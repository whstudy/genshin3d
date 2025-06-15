import { ref, watchEffect, onMounted, onUnmounted } from 'vue';

export function useLocalStorage(key: string, defaultValue: any) {
  // 创建响应式引用，初始值从localStorage获取或使用默认值
  const storedValue = ref(defaultValue);

  // 读取localStorage的辅助函数
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  };

  // 初始化时设置值
  storedValue.value = readValue();

  // 监听响应式变量变化，自动保存到localStorage
  watchEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue.value));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  });

  // 处理storage事件，跨页面同步
  const handleStorageChange = (event: any) => {
    if (event.key === key) {
      storedValue.value = readValue();
    }
  };

  // 添加事件监听
  onMounted(() => {
    window.addEventListener('storage', handleStorageChange);
  });

  // 清理事件监听
  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange);
  });

  return storedValue;
}
