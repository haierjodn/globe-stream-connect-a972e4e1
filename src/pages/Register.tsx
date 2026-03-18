import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [step, setStep] = useState<1 | 2>(1); // 1: verify phone, 2: set password

  const startCooldown = useCallback(() => {
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSendCode = () => {
    if (!phone.trim()) { toast.error("请输入手机号"); return; }
    if (cooldown > 0) return;
    toast.success("验证码已发送（模拟）");
    startCooldown();
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!phone.trim()) { toast.error("请输入手机号"); return; }
      if (!code.trim()) { toast.error("请输入验证码"); return; }
      setStep(2);
    } else {
      if (!password.trim()) { toast.error("请设置登录密码"); return; }
      if (password.length < 6) { toast.error("密码至少6位"); return; }
      if (password !== confirmPwd) { toast.error("两次密码不一致"); return; }
      toast.success("注册成功，请登录");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border p-8 space-y-6">
        <div className="text-center space-y-2">
          <img src="/favicon.png" alt="Seaisee" className="mx-auto h-14 w-14 rounded-xl object-contain" />
          <h1 className="text-2xl font-bold tracking-tight">注册账号</h1>
          <p className="text-sm text-muted-foreground">
            {step === 1 ? "使用手机号注册" : "设置登录密码"}
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label>手机号</Label>
                <Input placeholder="请输入手机号" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>验证码</Label>
                <div className="flex gap-2">
                  <Input placeholder="请输入验证码" value={code} onChange={e => setCode(e.target.value)} />
                  <Button type="button" variant="outline" className="shrink-0 w-28" disabled={cooldown > 0} onClick={handleSendCode}>
                    {cooldown > 0 ? `${cooldown}s` : "获取验证码"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>设置密码</Label>
                <Input type="password" placeholder="请设置登录密码（至少6位）" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>确认密码</Label>
                <Input type="password" placeholder="请再次输入密码" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            {step === 1 ? "下一步" : "完成注册"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          已有账号？<Link to="/login" className="text-primary hover:underline font-medium">返回登录</Link>
        </div>
      </div>
    </div>
  );
}
