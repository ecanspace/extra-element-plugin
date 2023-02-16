<template>
<div>
<h2>Linkage 联动选择器</h2>
<p>若干个具有联动关系的选择器的组合选择器。</p>
<elpro-demo>
      <!-- <template>
  <el-alert
    title="不可关闭的 alert"
    type="success"
    :closable="false">
  </el-alert>
  <el-alert
    title="自定义 close-text"
    type="info"
    close-text="知道了">
  </el-alert>
  <el-alert
    title="设置了回调的 alert"
    type="warning"
    @close="hello">
  </el-alert>
</template>

<script>
  export default {
    methods: {
      hello() {
        alert('Hello World!');
      }
    }
  }
</script>
 -->
      <pre><code class="language-html">&lt;template&gt;
  &lt;el-alert
    title=&quot;不可关闭的 alert&quot;
    type=&quot;success&quot;
    :closable=&quot;false&quot;&gt;
  &lt;/el-alert&gt;
  &lt;el-alert
    title=&quot;自定义 close-text&quot;
    type=&quot;info&quot;
    close-text=&quot;知道了&quot;&gt;
  &lt;/el-alert&gt;
  &lt;el-alert
    title=&quot;设置了回调的 alert&quot;
    type=&quot;warning&quot;
    @close=&quot;hello&quot;&gt;
  &lt;/el-alert&gt;
&lt;/template&gt;

&lt;script&gt;
  export default {
    methods: {
      hello() {
        alert('Hello World!');
      }
    }
  }
&lt;/script&gt;
</code></pre>
</elpro-demo></div>
</template>