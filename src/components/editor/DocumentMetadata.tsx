import yaml from 'js-yaml'

interface DocumentMetadataProps {
  data: Record<string, unknown>
}

export function DocumentMetadata({ data }: DocumentMetadataProps) {
  const { id, ...rest } = data
  const metadata = yaml.dump(rest, { flowLevel: 1 }).replace(/[{}\n]/g, ' ').trim()

  return (
    <div className='text-sm opacity-75 truncate'>
      {metadata}
    </div>
  )
}