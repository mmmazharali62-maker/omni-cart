// Blog article typography (spec section 2): renders sanitized markdown HTML.
export function Prose({ html }: { html: string }) {
  return (
    <article
      className="max-w-none text-white/80 leading-7
        [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-3
        [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3
        [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2
        [&_p]:mb-4
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
        [&_a]:text-brand-400 [&_a]:underline
        [&_code]:glass [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
