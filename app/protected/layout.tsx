import Sidebar from "@/components/shared/sidebar";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full h-full p-4">
            <div className="fixed top-0 left-0 h-screen">
                <Sidebar />
            </div>
            <div className="ml-32">{children}</div>
        </div>
    );
}
