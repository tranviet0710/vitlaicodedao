'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react'

// Disable static generation for auth page
export const dynamic = 'force-dynamic'

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signIn, signUp, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({ email: '', password: '', fullName: '' })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/admin')
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(loginData.email, loginData.password)

      if (error) {
        toast({
          title: 'Đăng nhập thất bại',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Đăng nhập thành công!',
          description: 'Chào mừng bạn quay lại.',
        })
        router.push('/admin')
      }
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signUp(signupData.email, signupData.password, signupData.fullName)

      if (error) {
        toast({
          title: 'Đăng ký thất bại',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Đăng ký thành công!',
          description: 'Vui lòng kiểm tra email để xác nhận tài khoản.',
        })
      }
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome</h1>
            <p className="text-muted-foreground">Sign in to access admin panel</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
