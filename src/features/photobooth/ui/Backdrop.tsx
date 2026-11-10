/** Signal-web 랜딩 느낌의 부드러운 블러 블롭 배경 */
export default function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="via-primary-50/60 to-secondary-50 absolute inset-0 bg-linear-to-b from-white" />
      <div className="animate-float bg-primary-200/60 absolute -top-[10%] -left-[15%] size-[55vmax] rounded-full blur-3xl" />
      <div className="animate-float-slow bg-secondary-300/50 absolute -right-[20%] -bottom-[15%] size-[60vmax] rounded-full blur-3xl" />
      <div className="animate-float bg-secondary-200/60 absolute top-[35%] right-[5%] size-[22vmax] rounded-full blur-3xl" />
    </div>
  );
}
