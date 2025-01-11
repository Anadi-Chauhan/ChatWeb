import GNavLink from "./GlobalNavlink";

export default function Navbar(){
    return(
        <>
            <div className="h-10 text-sm font-roboto font-semibold p-2 " >
                <div>
                    <ul className="text-gray-200 flex gap-10 justify-end mr-10 " >
                        <li className="hover:text-white hover:underline">
                            <GNavLink href='/register'>Register</GNavLink>
                        </li>
                        <li className="hover:text-white hover:underline">
                            <GNavLink href='/login'>LogIn</GNavLink>
                        </li>
                        <li className="hover:text-white hover:underline">
                            <GNavLink href='/room'>Guest Room</GNavLink>
                        </li>
                        <li className="hover:text-white hover:underline">
                            <GNavLink href='/support'>Support</GNavLink>
                        </li>
                        <li className="hover:text-white hover:underline">
                            <GNavLink href='/terms'>Terms&Conditions</GNavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}