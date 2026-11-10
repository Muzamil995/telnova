import Link from "next/link";
import { C, HL, BD, SHADOW } from "@/components/landing/tokens";
import Icon from "@/components/landing/Icon";

export function InactiveAccountNotice() {
  return (
    <div
      className="w-full rounded-2xl p-6"
      style={{
        backgroundColor: "#fff7ed",
        border: "1px solid #fed7aa",
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        <Icon
          name="warning"
          size={20}
          style={{ color: "#ea580c", marginTop: 2, flexShrink: 0 }}
        />
        <div>
          <h3
            className="font-extrabold text-base"
            style={{ ...HL, color: "#9a3412" }}
          >
            Account inactive
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "#c2410c", ...BD }}>
            Your account is inactive. Verify your account in order to use our
            services.
          </p>
        </div>
      </div>
      <Link
        href="/signup"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
        style={{ backgroundColor: C.primary, color: "#ffffff", ...BD }}
      >
        Verify account
      </Link>
    </div>
  );
}

export function InactiveAccountNotice() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Account inactive</CardTitle>
        <CardDescription>
          Your account is inactive. Verify your account in order to use our
          services.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button asChild>
          <Link href="/signup">Verify account</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
