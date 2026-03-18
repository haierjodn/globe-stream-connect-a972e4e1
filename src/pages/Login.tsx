import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Password login
  const [phone, setPhone] = useState("13800001234");
  const [password, setPassword] = useState("demo1234");

  // SMS login
  const [smsPhone, setSmsPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [smsCooldown, setSmsCooldown] = useState(0);

  // Forgot password
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotType, setForgotType] = useState<"phone" | "email">("phone");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotCooldown, setForgotCooldown] = useState(0);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const startCooldown = useCallback((setter: (v: number) => void) => {
    setter(60);
    const timer = setInterval(() => {
      setter(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) { toast.error("请输入手机号和密码"); return; }
    if (login(phone, password)) navigate("/dashboard");
  };

  const handleSmsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsPhone.trim()) { toast.error("请输入手机号"); return; }
    if (!smsCode.trim()) { toast.error("请输入验证码"); return; }
    if (login(smsPhone, "sms")) navigate("/dashboard");
  };

  const handleSendSms = (phoneTo: string, cooldown: number, setter: (v: number) => void) => {
    if (!phoneTo.trim()) { toast.error("请输入手机号"); return; }
    if (cooldown > 0) return;
    toast.success("验证码已发送（模拟）");
    startCooldown(setter);
  };

  const handleForgotSubmit = () => {
    if (forgotStep === 1) {
      if (forgotType === "phone" && !forgotPhone.trim()) { toast.error("请输入手机号"); return; }
      if (forgotType === "email" && !forgotEmail.trim()) { toast.error("请输入邮箱"); return; }
      if (!forgotCode.trim()) { toast.error("请输入验证码"); return; }
      setForgotStep(2);
    } else {
      if (!newPwd.trim()) { toast.error("请输入新密码"); return; }
      if (newPwd !== confirmPwd) { toast.error("两次密码不一致"); return; }
      toast.success("密码重置成功，请使用新密码登录");
      setForgotOpen(false);
      setForgotStep(1);
      setForgotCode(""); setNewPwd(""); setConfirmPwd("");
    }
  };

  if (forgotOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border p-8 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold">找回密码</h1>
            <p className="text-sm text-muted-foreground">
              {forgotStep === 1 ? "验证身份信息" : "设置新密码"}
            </p>
          </div>

          {forgotStep === 1 ? (
            <div className="space-y-4">
              <Tabs value={forgotType} onValueChange={v => setForgotType(v as "phone" | "email")}>
                <TabsList className="w-full">
                  <TabsTrigger value="phone" className="flex-1">手机找回</TabsTrigger>
                  <TabsTrigger value="email" className="flex-1">邮箱找回</TabsTrigger>
                </TabsList>
                <TabsContent value="phone" className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>手机号</Label>
                    <Input placeholder="请输入手机号" value={forgotPhone} onChange={e => setForgotPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>验证码</Label>
                    <div className="flex gap-2">
                      <Input placeholder="请输入验证码" value={forgotCode} onChange={e => setForgotCode(e.target.value)} />
                      <Button type="button" variant="outline" className="shrink-0 w-28" disabled={forgotCooldown > 0}
                        onClick={() => handleSendSms(forgotPhone, forgotCooldown, setForgotCooldown)}>
                        {forgotCooldown > 0 ? `${forgotCooldown}s` : "获取验证码"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="email" className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>邮箱</Label>
                    <Input type="email" placeholder="请输入邮箱" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>验证码</Label>
                    <div className="flex gap-2">
                      <Input placeholder="请输入验证码" value={forgotCode} onChange={e => setForgotCode(e.target.value)} />
                      <Button type="button" variant="outline" className="shrink-0 w-28" disabled={forgotCooldown > 0}
                        onClick={() => { if (!forgotEmail.trim()) { toast.error("请输入邮箱"); return; } toast.success("验证码已发送（模拟）"); startCooldown(setForgotCooldown); }}>
                        {forgotCooldown > 0 ? `${forgotCooldown}s` : "获取验证码"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>新密码</Label>
                <Input type="password" placeholder="请输入新密码" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>确认密码</Label>
                <Input type="password" placeholder="请再次输入密码" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setForgotOpen(false); setForgotStep(1); }}>返回登录</Button>
            <Button className="flex-1" onClick={handleForgotSubmit}>
              {forgotStep === 1 ? "下一步" : "确认重置"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border p-8 space-y-6">
        <div className="text-center space-y-2">
          <img src="/favicon.png" alt="Seaisee" className="mx-auto h-14 w-14 rounded-xl object-contain" />
          <h1 className="text-2xl font-bold tracking-tight">Seaisee</h1>
          <p className="text-sm text-muted-foreground">跨境电商智能运营平台</p>
        </div>

        <Tabs defaultValue="password">
          <TabsList className="w-full">
            <TabsTrigger value="password" className="flex-1">密码登录</TabsTrigger>
            <TabsTrigger value="sms" className="flex-1">验证码登录</TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <form onSubmit={handlePasswordLogin} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input id="phone" placeholder="请输入手机号" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">登录密码</Label>
                <Input id="password" type="password" placeholder="请输入密码" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:underline" onClick={() => setForgotOpen(true)}>忘记密码？</button>
              </div>
              <Button type="submit" className="w-full">登 录</Button>
            </form>
          </TabsContent>

          <TabsContent value="sms">
            <form onSubmit={handleSmsLogin} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>手机号</Label>
                <Input placeholder="请输入手机号" value={smsPhone} onChange={e => setSmsPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>验证码</Label>
                <div className="flex gap-2">
                  <Input placeholder="请输入验证码" value={smsCode} onChange={e => setSmsCode(e.target.value)} />
                  <Button type="button" variant="outline" className="shrink-0 w-28" disabled={smsCooldown > 0}
                    onClick={() => handleSendSms(smsPhone, smsCooldown, setSmsCooldown)}>
                    {smsCooldown > 0 ? `${smsCooldown}s` : "获取验证码"}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:underline" onClick={() => setForgotOpen(true)}>忘记密码？</button>
              </div>
              <Button type="submit" className="w-full">登 录</Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          还没有账号？<Link to="/register" className="text-primary hover:underline font-medium">立即注册</Link>
        </div>
      </div>
    </div>
  );
}
