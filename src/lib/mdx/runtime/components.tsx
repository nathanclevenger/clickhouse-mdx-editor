import * as React from 'react'

export const defaultComponents = {
  h1: (props: any) => <h1 {...props} className='text-3xl font-bold mb-4' />,
  h2: (props: any) => <h2 {...props} className='text-2xl font-bold mb-3' />,
  h3: (props: any) => <h3 {...props} className='text-xl font-bold mb-2' />,
  p: (props: any) => <p {...props} className='mb-4 leading-7' />,
  ul: (props: any) => <ul {...props} className='list-disc pl-5 mb-4 space-y-2' />,
  ol: (props: any) => <ol {...props} className='list-decimal pl-5 mb-4 space-y-2' />,
  li: (props: any) => <li {...props} className='mb-1' />,
  blockquote: (props: any) => (
    <blockquote {...props} className='border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4' />
  ),
  code: (props: any) => (
    <code {...props} className='bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono' />
  ),
  pre: (props: any) => (
    <pre {...props} className='bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto font-mono text-sm' />
  ),
  a: (props: any) => (
    <a
      {...props}
      className='text-blue-600 dark:text-blue-400 hover:underline'
      target='_blank'
      rel='noopener noreferrer'
    />
  ),
  hr: (props: any) => (
    <hr {...props} className='my-8 border-t border-gray-200 dark:border-gray-700' />
  ),
  img: (props: any) => (
    <img {...props} className='max-w-full h-auto rounded-lg my-4' />
  ),
  table: (props: any) => (
    <table {...props} className='min-w-full my-4 border-collapse' />
  ),
  th: (props: any) => (
    <th {...props} className='border border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800' />
  ),
  td: (props: any) => (
    <td {...props} className='border border-gray-200 dark:border-gray-700 px-4 py-2' />
  )
}