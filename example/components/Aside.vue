<script>
import nav from '../locale/nav.json'
export default {
  name: 'AppAside',
  data() {
    return {
      navList: nav.data,
    }
  },
  render(h) {
    const data = this.navList
    return (
      <div class="app-aside__wrapper">
        <div class="app-aside">{this.renderNav(data)}</div>
      </div>
    )
  },
  methods: {
    renderNav(data) {
      if (!data || data.length === 0) return null

      const NavItems = data.map((item) => (
        <div class={['nav-item', item.level === 1 ? 'is-main' : 'is-sub']}>
          <a href={'#' + item.path || 'javascript:void(0);'}>{item.label}</a>
          {this.renderNav(item.children)}
        </div>
      ))

      return (
        <div class="nav-list">{NavItems}</div>
      )
    }
  }
}
</script>

<style scoped>
.app-aside__wrapper {
  position: fixed;
  width: 260px;
  height: 100%;
  padding-right: 20px;
  box-sizing: border-box;
}
.app-aside {
  width: 240px;
  padding: 36px 0;
}
.nav-list {
  padding: 0 5px;
}
.nav-item > a {
  text-decoration: none;
  display: block;
  height: 40px;
  line-height: 40px;
  color: #444;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.nav-item.is-main > a {
  color: #303133;
  font-size: 16px;
  font-weight: bold;
  cursor: initial;
}
</style>