import React from "react";

const ScrollFadeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
return (
<div className="relative overflow-x-auto overflow-y-hidden">

<div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#fdf6f1] to-transparent z-10" />
<div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#fdf6f1] to-transparent z-10" />

<div className="flex min-w-0 max-w-full overflow-x-auto space-x-2 px-8 py-2 no-scrollbar">
{children}
</div>
</div>
);
};

export default ScrollFadeWrapper;