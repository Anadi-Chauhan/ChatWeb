import { Providers } from "../Provider";
import SideBar from "./Sidebar";

export default function HomeComponent() {
    return (
        <>
        <Providers>
            <div>
                    <SideBar />
            </div>
        </Providers>
        </>
    )
}