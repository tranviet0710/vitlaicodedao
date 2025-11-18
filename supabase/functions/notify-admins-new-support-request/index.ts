import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SupportRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { supportRequest }: { supportRequest: SupportRequest } = await req.json();

    // Get all admin users with notification preferences
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (rolesError) throw rolesError;

    if (!adminRoles || adminRoles.length === 0) {
      console.log('No admins found');
      return new Response(
        JSON.stringify({ message: 'No admins to notify' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get admin emails and their notification preferences
    const adminUserIds = adminRoles.map(r => r.user_id);
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', adminUserIds);

    if (profilesError) throw profilesError;

    const { data: preferences, error: prefsError } = await supabase
      .from('admin_notification_preferences')
      .select('user_id, notify_on_support_request')
      .in('user_id', adminUserIds);

    if (prefsError) throw prefsError;

    // Filter admins who want notifications (default to true if no preference set)
    const adminsToNotify = profiles?.filter(profile => {
      const pref = preferences?.find(p => p.user_id === profile.id);
      return pref ? pref.notify_on_support_request : true;
    }) || [];

    if (adminsToNotify.length === 0) {
      console.log('No admins opted in for notifications');
      return new Response(
        JSON.stringify({ message: 'No admins opted in for notifications' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send emails using Resend
    const emailPromises = adminsToNotify.map(async (admin) => {
      const emailBody = {
        from: 'VietDev Support <onboarding@resend.dev>',
        to: [admin.email!],
        subject: '🔔 Yêu cầu hỗ trợ mới',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Yêu cầu hỗ trợ mới</h2>
            <p>Có một yêu cầu hỗ trợ mới từ khách hàng:</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Tên:</strong> ${supportRequest.name}</p>
              <p><strong>Email:</strong> ${supportRequest.email}</p>
              ${supportRequest.phone ? `<p><strong>Số điện thoại:</strong> ${supportRequest.phone}</p>` : ''}
              <p><strong>Nội dung:</strong></p>
              <p style="white-space: pre-wrap;">${supportRequest.message}</p>
            </div>
            
            <p>Vui lòng đăng nhập vào trang quản trị để xem và xử lý yêu cầu này.</p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Bạn nhận được email này vì bạn là quản trị viên và đã bật thông báo cho yêu cầu hỗ trợ mới.
              Bạn có thể thay đổi cài đặt thông báo trong trang quản trị.
            </p>
          </div>
        `,
      };

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify(emailBody),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to send email to ${admin.email}:`, error);
        throw new Error(`Resend API error: $No changes to apply. The old_string and new_string are identical in file: /Users/mac-VTRANC01/Desktop/vitlaicodedao/vitlaicodedao/supabase/functions/notify-admins-new-support-request/index.ts`);
      }

      return response.json();
    });

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Sent ${successful} emails, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        message: `Notifications sent to ${successful} admin(s)`,
        successful,
        failed 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
