import Sidebar from "@/components/shared/sidebar";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full min-h-screen flex">
            <div className="fixed top-0 left-0 h-full">
                <Sidebar />
            </div>
            <div className="ml-32 flex-1 bg-[#C6E4EE]">{children}</div>
        </div>
    );
}
