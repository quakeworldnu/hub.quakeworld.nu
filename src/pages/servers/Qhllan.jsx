import { Divide } from "lucide-react";

export function Qhlan2026() {
  return (
    <div className="bg-gradient-to-r from-lime-500/60 to-green-500/60 p-1 rounded">
      <div className="bg-[#010] px-6 pt-2 pb-6">
        <div className="h-32">
          <video autoPlay muted loop playsInline className="size-full">
            <source
              src="https://qhlan.org/assets/sparks2026.webm"
              type="video/webm"
            />
          </video>
        </div>
        <div className="flex items-center gap-6 justify-center text-lime-300 underline underline-offset-2">
          <a className="hover:text-yellow-300" href="https://www.qhlan.org">
            Website
          </a>
          <a
            className="hover:text-yellow-300"
            href="https://www.quakeworld.nu/wiki/QHLAN2026"
          >
            Wiki
          </a>
          <a
            className="hover:text-yellow-300"
            href="https://discord.gg/vB2CnaQkbe"
          >
            Discord
          </a>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_2fr] gap-x-4 gap-y-2">
          <div className="text-green-300 text-right">Wednesday</div>
          <div>
            09:00 &nbsp; Doors Open <br />
            15:00 &nbsp; FFA Starts <br /> 17:00 &nbsp; 2on2
          </div>
          <div className="text-green-300 text-right">Thursday</div>
          <div>
            11:00 &nbsp; 1on1
            <br />
            22:00 &nbsp; 4on4 draft ceremony
            <br />
          </div>
          <div className="text-green-300 text-right">Friday</div>
          <div>11:00 &nbsp; 4on4 draft</div>
          <div className="text-green-300 text-right">Saturday</div>
          <div>11:00 &nbsp; 4on4 clans</div>
          <div className="text-green-300 text-right">Sunday</div>
          <div>15:00 &nbsp; Doors close</div>
          <div className="col-span-2 text-center mt-2">
            <a
              href="https://www.quakeworld.nu/wiki/QHLAN2026/Event_Schedule"
              className="text-lime-300 hover:text-yellow-300 underline underline-offset-2"
            >
              Detailed schedule &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
