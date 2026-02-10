// Ant Design theme configuration dengan palet warna coklat clean
export const wastraTheme = {
  token: {
    // Primary color - Clean Brown
    colorPrimary: '#6B5438',
    
    // Success, Warning, Error colors
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    
    // Background colors
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    
    // Text colors
    colorText: '#2E2418',
    colorTextSecondary: '#6B5438',
    colorTextTertiary: '#8B6F47',
    
    // Border colors
    colorBorder: '#E8E0D5',
    colorBorderSecondary: '#F5F1EB',
    
    // Font
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    
    // Border radius - clean & modern
    borderRadius: 8,
  },
  components: {
    Button: {
      primaryColor: '#FFFFFF',
      borderRadius: 8,
      fontWeight: 500,
    },
    Card: {
      borderRadius: 12,
      padding: 24,
    },
    Input: {
      borderRadius: 8,
      paddingBlock: 8,
    },
    Select: {
      borderRadius: 8,
    },
  },
}
