export default function LinkBadge(props: any) {

  return (
    <>
      <a href={props.url} target="_blank" className="inline-flex  items-center rounded-sm px-2 py-1 text-sm   text-theme-yellow border border-theme-yellow text-center mx-1.5 mb-2">
        {props.title}
      </a>
    </>
  )
}