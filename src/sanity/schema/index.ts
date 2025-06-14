// Asset Schemas
import photo from './assets/photo'
import svg from './assets/svg'
import video from './assets/video'
import model3d from './assets/model3d'

// Document Schemas
import about from './documents/about'
import userArr from './documents/author'
import blog from './documents/blog'
import category from './documents/category'
import globalBanner from './documents/globalBanner'
import page from './documents/page'
import project from './documents/project'
import route from './documents/route'
import settings from './documents/settings'
import tag from './documents/tag'

// Object Schemas
import blockContent from './objects/blockContent'
import contactForm from './objects/contactForm'
import localeString from './objects/localeString'
import navItem from './objects/navItem'
import orderableDocumentList from './objects/orderableDocumentList'
import pageSections from './objects/pageSections'
import seo from './objects/seo'
import website from './objects/website'

export const schemaTypes = [
  // Documents
  about,
  userArr,
  blog,
  category,
  globalBanner,
  page,
  project,
  route,
  settings,
  tag,

  // Assets
  photo,
  svg,
  video,
  model3d,

  // Objects
  blockContent,
  contactForm,
  localeString,
  navItem,
  orderableDocumentList,
  seo,
  ...pageSections,
  website,
]
