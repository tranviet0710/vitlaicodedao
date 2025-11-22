import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { supportRequest }: { supportRequest: SupportRequest } =
      await req.json();

    // Get all admin users with notification preferences
    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesError) throw rolesError;

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admins found");
      return new Response(JSON.stringify({ message: "No admins to notify" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get admin emails and their notification preferences
    const adminUserIds = adminRoles.map((r) => r.user_id);

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", adminUserIds);

    if (profilesError) throw profilesError;

    const { data: preferences, error: prefsError } = await supabase
      .from("admin_notification_preferences")
      .select("user_id, notify_on_support_request")
      .in("user_id", adminUserIds);

    if (prefsError) throw prefsError;

    // Filter admins who want notifications (default to true if no preference set)
    const adminsToNotify =
      profiles?.filter((profile) => {
        const pref = preferences?.find((p) => p.user_id === profile.id);
        return pref ? pref.notify_on_support_request : true;
      }) || [];

    if (adminsToNotify.length === 0) {
      console.log("No admins opted in for notifications");
      return new Response(
        JSON.stringify({ message: "No admins opted in for notifications" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send emails using Resend
    const emailPromises = adminsToNotify.map(async (admin) => {
      const emailBody = {
        from: "VietDev Support <vietdev@vitlaicodedao.tech>",
        to: [admin.email!, "trancongviet0710@gmail.com"],
        subject: "🔔 Yêu cầu hỗ trợ mới",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f4f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                          🔔 Yêu cầu hỗ trợ mới
                        </h1>
                        <p style="margin: 10px 0 0 0; color: #e9d5ff; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                          Có một yêu cầu hỗ trợ mới cần được xử lý
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                          Xin chào! Bạn có một yêu cầu hỗ trợ mới từ khách hàng:
                        </p>
                        
                        <!-- Customer Info Card -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                          <tr>
                            <td style="padding: 24px;">
                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <span style="display: inline-block; color: #6b7280; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; min-width: 120px;">👤 Tên:</span>
                                    <span style="color: #111827; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${
                                      supportRequest.name
                                    }</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <span style="display: inline-block; color: #6b7280; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; min-width: 120px;">📧 Email:</span>
                                    <a href="mailto:${
                                      supportRequest.email
                                    }" style="color: #667eea; font-size: 15px; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${
          supportRequest.email
        }</a>
                                  </td>
                                </tr>
                                ${
                                  supportRequest.phone
                                    ? `<tr>
                                        <td style="padding: 8px 0;">
                                          <span style="display: inline-block; color: #6b7280; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; min-width: 120px;">📱 Điện thoại:</span>
                                          <a href="tel:${supportRequest.phone}" style="color: #667eea; font-size: 15px; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${supportRequest.phone}</a>
                                        </td>
                                      </tr>`
                                    : ""
                                }
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Message Content -->
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 20px; margin-bottom: 32px;">
                          <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                            💬 Nội dung yêu cầu:
                          </p>
                          <p style="margin: 0; color: #451a03; font-size: 15px; line-height: 1.6; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                            ${supportRequest.message}
                          </p>
                        </div>
                        
                        <!-- CTA Button -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                          <tr>
                            <td align="center">
                              <a href="https://vitlaicodedao.tech/admin/support-requests" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                                🚀 Xem và xử lý yêu cầu
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                          Vui lòng đăng nhập vào <a href="https://vitlaicodedao.tech" style="color: #667eea; text-decoration: none; font-weight: 600;">vitlaicodedao.tech</a> để xem chi tiết và thực hiện hành động cần thiết.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.6; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                          Bạn nhận được email này vì bạn là quản trị viên và đã bật thông báo cho yêu cầu hỗ trợ mới.<br>
                          Bạn có thể thay đổi cài đặt thông báo trong trang quản trị.
                        </p>
                        <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 12px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                          © 2025 VietDev - vitlaicodedao.tech
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      };

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify(emailBody),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to send email to ${admin.email}:`, error);
        throw new Error(
          `Resend API error: $No changes to apply. The old_string and new_string are identical in file: /Users/mac-VTRANC01/Desktop/vitlaicodedao/vitlaicodedao/supabase/functions/notify-admins-new-support-request/index.ts`
        );
      }

      return response.json();
    });

    const results = await Promise.allSettled(emailPromises);

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(`Sent ${successful} emails, ${failed} failed`);

    return new Response(
      JSON.stringify({
        message: `Notifications sent to ${successful} admin(s)`,
        successful,
        failed,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
