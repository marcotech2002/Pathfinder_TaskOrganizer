export interface NavigationOption {
  routeLink: string
  label: string
}

export const navigationData: NavigationOption[] = [
  {
    routeLink: 'tasks',
    label: 'Tasks'
  },
  {
    routeLink: 'categories',
    label: 'Categories'
  }
]
