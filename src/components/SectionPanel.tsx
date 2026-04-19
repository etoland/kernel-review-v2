interface Props {
    title: string
    description: string
    children: React.ReactNode
  }
  
  export default function SectionPanel({ title, description, children }: Props) {
    return (
      <div className="flex flex-col gap-5 px-8 py-7">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
        {children}
      </div>
    )
  }