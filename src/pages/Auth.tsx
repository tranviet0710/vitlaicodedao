import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', fullName: '' });

  // Redirect if already logged in
  if (user) {
    navigate('/admin');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);

      if (error) {
        toast({
          title: 'Đăng nhập thất bại',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Đăng nhập thành công!',
          description: 'Chào mừng bạn quay lại.',
        });
        navigate('/admin');
      }
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signUp(signupData.email, signupData.password, signupData.fullName);

      if (error) {
        toast({
          title: 'Đăng ký thất bại',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Đăng ký thành công!',
          description: 'Vui lòng kiểm tra email để xác nhận tài khoản.',
        });
        setSignupData({ email: '', password: '', fullName: '' });
      }
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Về trang chủ
        </Button>

        <Card className="p-8 bg-card border-border/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Admin Portal</h1>
            <p className="text-foreground/60">Quản lý nội dung website</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="signup">Đăng ký</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mật khẩu</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary"
                  disabled={isLoading}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Họ và tên</label>
                  <Input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mật khẩu</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary"
                  disabled={isLoading}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
