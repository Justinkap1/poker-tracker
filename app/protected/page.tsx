import Sidebar from "@/components/shared/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col w-full h-full p-8 pl-20">
      <div className="text-7xl font-bold">Home</div>
      <div className="flex-grow min-h-0 min-w-0 grid grid-cols-2 grid-rows-2 gap-4">
        <span className="border border-black rounded-md w-full h-full flex items-center justify-center">Hello</span>
        <span className="border border-black rounded-md w-full h-full flex items-center justify-center">Hello</span>
        <span className="border border-black rounded-md w-full h-full flex items-center justify-center">Hello</span>
        <span className="border border-black rounded-md w-full h-full flex items-center justify-center">Hello</span>
      </div>
    </div>
  );
}
