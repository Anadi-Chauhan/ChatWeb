import Marquee from "react-fast-marquee";
import Avatar from "../Components/helpers/Avatar";

export default function MarqueeComp() {
    return (
        <>
             <Marquee
              speed={20}
              direction="left"
              pauseOnHover={true}
              gradient={false}
            >
              <div className="w-[270px] h-40 ml-4  shadow-2xl bg-slate-700 rounded-xl mt-60">
                <p className="text-xs p-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="ml-2 flex gap-3 items-center mt-10">
                  <Avatar
                    height={30}
                    width={30}
                    imageUrl="./background2.jpg"
                    name={"Anadi Chauhan"}
                  />
                  <p>Anadi Chauhan</p>
                </div>
              </div>{" "}
              <div className="w-[270px] h-40 ml-4  shadow-2xl bg-slate-700 rounded-xl mt-60">
                <p className="text-xs p-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="ml-2 flex gap-3 items-center mt-10">
                  <Avatar
                    height={30}
                    width={30}
                    imageUrl="./background2.jpg"
                    name={"Anadi Chauhan"}
                  />
                  <p>Anadi Chauhan</p>
                </div>
              </div>{" "}
              <div className="w-[270px] h-40 ml-4  shadow-2xl bg-slate-700 rounded-xl mt-60">
                <p className="text-xs p-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="ml-2 flex gap-3 items-center mt-10">
                  <Avatar
                    height={30}
                    width={30}
                    imageUrl="./background2.jpg"
                    name={"Anadi Chauhan"}
                  />
                  <p>Anadi Chauhan</p>
                </div>
              </div>{" "}
              <div className="w-[270px] h-40 ml-4  shadow-2xl bg-slate-700 rounded-xl mt-60">
                <p className="text-xs p-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="ml-2 flex gap-3 items-center mt-10">
                  <Avatar
                    height={30}
                    width={30}
                    imageUrl="./background2.jpg"
                    name={"Anadi Chauhan"}
                  />
                  <p>Anadi Chauhan</p>
                </div>
              </div>
            </Marquee>
        </>
    )
}