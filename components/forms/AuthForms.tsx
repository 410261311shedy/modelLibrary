import React from "react";
import {Form, Input, Button} from "@heroui/react";
import {useRouter} from "next/navigation";
import {Eye,EyeOff} from "lucide-react";

type AuthFormType = "SIGN_IN" | "SIGN_UP";

type AuthFormProps<TValues extends Record<string, string>> = {
    schema?: unknown; // 目前不使用 zod，保留 signature
    defaultValues: TValues;
    formType: AuthFormType;
    onSubmit: (values: TValues) => Promise<{success: boolean}>;
};

type ErrorMap = Record<string, string | undefined>;

function getLabelFromName(name: string) {
    if (name === "email") return "Email Address";
    if (name === "password") return "Password";
    // 其他欄位：首字母大寫
    return name.charAt(0).toUpperCase() + name.slice(1);
}

// 驗證邏輯依照你給的規格書實作
function validateField(
formType: AuthFormType,
name: string,
value: string
): string | null {
    // 共用：trim
    const v = value ?? "";

    if (formType === "SIGN_IN") {
        if (name === "username") {
            if (!v) return "Username is required.";
      // 登入時通常不需要像註冊那樣檢查長度或正則表達式，只要有填寫即可
      // 如果你需要更嚴格的檢查，可以把 SIGN_UP 的邏輯搬過來
            }
        

        if (name === "password") {
        if (v.length < 6) {
            return "password must be at least 6 characters.";
        }
        if (v.length > 100) {
            return "password cannot exceed 100 characters.";
        }
        }
    }

    if (formType === "SIGN_UP") {
        if (name === "username") {
        if (v.length < 3) {
            return "Username must be at least 3 characters long.";
        }
        if (v.length > 30) {
            return "Username cannot exceed 30 characters.";
        }
        if (!/^[A-Za-z0-9_]+$/.test(v)) {
            return "Username can only contain letters, numbers, and underscores.";
        }
        }

        if (name === "name") {
        if (!v) {
            return "Name is required.";
        }
        if (v.length > 50) {
            return "Name cannot exceed 50 characters.";
        }
        if (!/^[A-Za-z\s]+$/.test(v)) {
            return "Name can only contain letters and spaces.";
        }
        }

        if (name === "email") {
        if (!v) {
            return "Email is required.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(v)) {
            return "Please provide a valid email address.";
        }
        }

        if (name === "password") {
        if (v.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (v.length > 100) {
            return "Password cannot exceed 100 characters.";
        }
        if (!/[A-Z]/.test(v)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(v)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/[0-9]/.test(v)) {
            return "Password must contain at least one number.";
        }
        if (!/[^A-Za-z0-9]/.test(v)) {
            return "Password must contain at least one special character.";
        }
        }
    }

    return null;
}

export function AuthForm<TValues extends Record<string, string>>(
props: AuthFormProps<TValues>
) {
const {defaultValues, formType, onSubmit} = props;
const router = useRouter();

const [values, setValues] = React.useState<TValues>(defaultValues);
const [errors, setErrors] = React.useState<ErrorMap>({});
const [isSubmitting, setIsSubmitting] = React.useState(false);

const handleChange = (name: string, value: string) => {
    setValues((prev) => ({...prev, [name]: value} as TValues));

    // 即時驗證
    const msg = validateField(formType, name, value);
    setErrors((prev) => ({...prev, [name]: msg || undefined}));
};

const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as TValues;

    // 全欄位驗證
    const newErrors: ErrorMap = {};
    for (const [name, value] of Object.entries(data)) {
    const msg = validateField(formType, name, String(value ?? ""));
    if (msg) newErrors[name] = msg;
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
    return;
    }

    setIsSubmitting(true);
    try {
    const result = await onSubmit(data);
    // 這裡假設 onSubmit 回傳 { success: boolean }，若失敗可在上層再傳回 field errors 給 validationErrors 使用
    if (!result.success) {
        // 若需要，這裡可以根據 server 回應更新 setErrors
    }
    } finally {
    setIsSubmitting(false);
    }
};

const submitLabel = formType === "SIGN_IN" ? "Sign In" : "Sign Up";
const submittingLabel =
    formType === "SIGN_IN" ? "Signing In..." : "Signing Up...";
const switchText =
    formType === "SIGN_IN"
    ? "Don't have an account?"
    : "Already have an account?";
const switchLinkText = formType === "SIGN_IN" ? "Sign up" : "Sign in";

// 這裡只負責渲染連結文字，實際切換路由由外層處理
const handleSwitchClick = () => {
    if(formType === "SIGN_IN") {
        router.push("/sign-up");
    }else{
        router.push("/sign-in");
    }
};
//for password visibility toggle
const [isVisible, setIsVisible] = React.useState(false);
const toggleVisibility = () => {
    setIsVisible(!isVisible);
}

return (
    <Form
    className="w-full space-y-3"
    validationBehavior="aria"
    validationErrors={errors}
    onSubmit={handleSubmit}
    >
    <div className="space-y-4 w-full">

        {Object.keys(defaultValues).map((name) => {
        const value = values[name] ?? "";
        const error = errors[name];
        const label = getLabelFromName(name);
        const type = name === "password" ? "password" : "text";
        const isRequired = true;

        return (
            <Input
            fullWidth
            key={name}
            name={name}
            label={label}
            labelPlacement="inside"
            isRequired={isRequired}
            type={type === "password" ? (isVisible ? "text" : "password") : (name === "email" ? "email" : "text")}
            value={value}
            onValueChange={(v) => handleChange(name, v)}
            isInvalid={!!error}
            errorMessage={error ?? undefined}
            placeholder={`Enter your ${label}`}
            classNames={{
                inputWrapper:
                "bg-white dark:bg-[#27272A] shadow-[0px_3px_2px_rgba(255,255,255,0.18),0px_0px_4px_rgba(255,255,255,0.24),inset_0px_3px_5px_rgba(0,0,0,0.64),inset_0px_-1px_2px_rgba(0,0,0,0.6)]",
            }}
            endContent={
                name === "password" ?
                (<button
                type="button"
                onClick={()=>{setIsVisible(!isVisible)}}
                className="focus:outline-none"
                >
                {!isVisible ? (<EyeOff className="size={20}"/>):(<Eye className="size={20}"/>)}
                </button>):null
            }
            />

        );
        })}

        <Button
        type="submit"
        color="primary"
        className="font-inter w-full shadow-[0px_0px_5px_rgba(0,0,0,0.70),inset_0px_-4px_5px_rgba(0,0,0,0.25),inset_0px_4px_5px_rgba(255,255,255,0.2)]"
        isDisabled={isSubmitting}
        >
        {isSubmitting ? submittingLabel : submitLabel}
        </Button>
        
    </div>

    <div className="pl-30 mt-0 text-sm text-default-500">
        {switchText}{" "}
        <button
        type="button"
        onClick={handleSwitchClick}
        className="hover:cursor-pointer font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400"
        >
        {switchLinkText}
        </button>
    </div>
    {/* -------OR------ */}
        <div className="flex items-center w-full gap-4 mt-0 mb-3">
            {/* 左邊的線：h-px 是高度 1px，flex-1 讓它自動佔滿空間 */}
            <div className="h-[1px] bg-zinc-700 flex-1" />
            
            {/* 中間的文字 */}
            <span className="text-black dark:text-zinc-500  text-xs uppercase">
                OR
            </span>
            
            {/* 右邊的線 */}
            <div className="h-[1px] bg-zinc-700 flex-1" />
        </div>
    </Form>
);
}