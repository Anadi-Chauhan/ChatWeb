import HomeComponent from "../MyComponents/HomeComponent";
import { Providers } from "../Provider";

export default function Layout({children}){
    return (
        <>
            <Providers>
             <div className="lg:grid-cols-[300px,1fr] h-screen max-h-screen lg:grid hidden">
              <section className="bg-slate-300">
                <HomeComponent />
              </section>
              {children}
            </div>
            </Providers>
        </>
    )
}