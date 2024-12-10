import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { remarkParseYaml } from './yaml-processor'

export const defaultPlugins = [
  remarkFrontmatter,
  remarkParseYaml,
  remarkGfm
]