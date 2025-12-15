import React from "react";
import {Form, Input, Button} from "@heroui/react";
import {useRouter} from "next/navigation";

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
    if (name === "email") {
    if (!v) return "Email is required.";
    // 簡單 email 判斷（HeroUI 也支援 type="email" 的原生驗證）[[Input](https://www.heroui.com/docs/components/input#input)]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v)) {
        return "Please provide a valid email address.";
    }
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

const title = formType === "SIGN_IN" ? "Sign In" : "Sign Up";
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

return (
    <Form
    className="w-full max-w-md space-y-6"
    validationBehavior="aria"
    validationErrors={errors}
    onSubmit={handleSubmit}
    >
    <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{title}</h1>

        {Object.keys(defaultValues).map((name) => {
        const value = values[name] ?? "";
        const error = errors[name];
        const label = getLabelFromName(name);
        const type = name === "password" ? "password" : "text";
        const isRequired = true;

        return (
            <Input
            key={name}
            name={name}
            label={label}
            labelPlacement="outside-top"
            isRequired={isRequired}
            type={name === "email" ? "email" : type}
            value={value}
            onValueChange={(v) => handleChange(name, v)}
            isInvalid={!!error}
            errorMessage={error ?? undefined}
            placeholder={label}
            />
        );
        })}

        <Button
        type="submit"
        color="primary"
        className="w-full"
        isDisabled={isSubmitting}
        >
        {isSubmitting ? submittingLabel : submitLabel}
        </Button>
    </div>

    <div className="text-center text-sm text-default-500">
        {switchText}{" "}
        <button
        type="button"
        onClick={handleSwitchClick}
        className="hover:cursor-pointer font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400"
        >
        {switchLinkText}
        </button>
    </div>
    </Form>
);
}