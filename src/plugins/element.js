import {
  ElButton,
  ElAside,
  ElContainer,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElPagination,
  ElSubmenu,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElImage,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElDatePicker,
  ElLoading,
  ElTooltip,
  ElSelect,
  ElOption,
  ElTree,
  ElCheckbox,
  ElTabPane,
  ElLink,
  ElDivider,
  ElTimeline,
  ElTimelineItem,
  ElCol,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
} from "element-plus";

["success", "warning", "info", "error"].forEach((type) => {
  ElMessage[type] = (options) => {
    if (typeof options === "string") {
      options = {
        message: options,
        type,
      };
    } else {
      options.type = type;
    }
    return ElMessage({ ...options, offset: 250 });
  };
});

const list = [
  ElButton,
  ElAside,
  ElContainer,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElPagination,
  ElSubmenu,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElImage,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElDatePicker,
  ElLoading,
  ElTooltip,
  ElSelect,
  ElOption,
  ElTree,
  ElCheckbox,
  ElTabPane,
  ElLink,
  ElDivider,
  ElTimeline,
  ElTimelineItem,
  ElCol,
  ElRadioGroup,
  ElRadio,
  ElCheckbox,
  ElCheckboxGroup,
];

export default (app) => {
  list.forEach((i) => app.use(i));
};
