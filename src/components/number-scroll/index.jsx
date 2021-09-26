import numScroll from '@/utils/number-scroll';
import { defineComponent, onMounted } from 'vue';

// const NumberScroll = (props) => {
//   console.log('props===>', props);
//   numScroll(`#${props.id}`, props.num);
//   return <div id={props.id} />;
// };
// export default NumberScroll;

export default defineComponent({
  props: {
    id: String,
    num: Number,
  },
  setup(props) {
    onMounted(() => {
      numScroll(`#${props.id}`, props.num);
    });
  },
  render() {
    return (
      <div id={this.id} />
    );
  },
});
