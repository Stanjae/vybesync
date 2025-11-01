import CSidebar from "@/components/cui/CSidebar";
import MobileNav from "@/components/cui/mobile/MobileNav";
import { getAuthSession } from "@/lib/actions";
export default async function PublicPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();
  return (
    <main className=" bg-foreground text-background h-dvh">
      <section className=" bg-foreground text-background h-full flex">
        <div className=" fixed bg-foreground text-background top-0 left-0 h-full z-50 w-0 hidden md:block md:w-[280px]">
          <CSidebar session={session} />
        </div>
        <div className=" bg-foreground text-background custom-scroll ml-0 md:ml-[280px] grow ">
          {children}
          <MobileNav session={session} />
        </div>
      </section>
    </main>
  );
}
