import type { Chapter } from '../../types/novel';

export const chapter03: Chapter = {
  id: 'ch03',
  index: 3,
  title: '机械男生的宿舍夜晚',
  subtitle: '四个人,一间宿舍,一晚上',
  intro:
    '九月,大学报到。机械学院 312 宿舍,上下铺,四个素不相识的人,要一起活四年。',
  startSceneId: 'c3-s1',
  status: 'ready',
  scenes: [
    {
      id: 'c3-s1',
      beats: [
        { id: 'c3-s1-b1', role: 'narration', text: '宿舍楼里全是新生和家长,行李箱滚轮在水泥地上"咕噜咕噜"地响,谁家的妈在走廊里喊"鞋柜放哪个柜子"。' },
        { id: 'c3-s1-b2', role: 'narration', text: '许川是第二个到的。先到的是邓一帆——一个戴细框眼镜的男生,正一个人安安静静在自己床位上铺床单。许川进门叫了声哥们儿,他抬头点了点,没多话。' },
        { id: 'c3-s1-b3', role: 'narration', text: '王浩然是第三个来的。一进门人就先到——嗓门、身形、味道。' },
        { id: 'c3-s1-b4', role: 'other', speaker: '王浩然', text: '兄弟们好兄弟们好!咱们以后就一家人啦!' },
        { id: 'c3-s1-b5', role: 'narration', text: '罗展最后到。穿了件牌子能认出来的 polo 衫,带了两个箱子,一台游戏笔记本提在手里像提菜。他爸来送的,放下东西,留了一句"少花钱,常打电话",转身就走了。' },
        { id: 'c3-s1-b6', role: 'self', text: '——四个人,基本就是一个班最常见的四种人。' },
      ],
      nextSceneId: 'c3-s2',
    },
    {
      id: 'c3-s2',
      beats: [
        { id: 'c3-s2-b1', role: 'narration', text: '晚上九点多,宿舍里行李也铺得差不多了,屋外的喊叫声渐渐稀下去。王浩然往床沿上一躺,腿一翘:' },
        { id: 'c3-s2-b2', role: 'other', speaker: '王浩然', text: '走啊,夜市!东门那边据说便宜大碗,我请头一顿!" 啤酒今晚也算我的!"' },
        { id: 'c3-s2-b3', role: 'other', speaker: '罗展', text: '行啊,反正我也饿了。' },
        { id: 'c3-s2-b4', role: 'narration', text: '邓一帆在自己桌前开了台灯,正翻一本厚得像砖头的《工程图学》,头都没抬:' },
        { id: 'c3-s2-b5', role: 'other', speaker: '邓一帆', text: '我不去了。明天有个新生引导会,先看几页。' },
        { id: 'c3-s2-b6', role: 'other', speaker: '王浩然', text: '哥你这第一天就开始整啊,你这是把自己整成研究生了啊。' },
        { id: 'c3-s2-b7', role: 'narration', text: '邓一帆只笑了笑没接,翻书的手没停。' },
        { id: 'c3-s2-b8', role: 'narration', text: '王浩然转头看许川:' },
        { id: 'c3-s2-b9', role: 'other', speaker: '王浩然', text: '哥你呢?走不走?' },
        { id: 'c3-s2-b10', role: 'self', text: '夜市,啤酒,撸串,凉风。' },
        { id: 'c3-s2-b11', role: 'self', text: '另一边,台灯,书,安静。' },
      ],
      choice: {
        prompt: '今晚怎么过?',
        options: [
          {
            id: 'c3-s2-c-haoran',
            label: '"走!" 跟王浩然他们出去夜市',
            hint: '硬撑↑ 浩然信任↑ 一帆失望↓ 健康↓',
            effects: {
              tendencies: { defiant: 5 },
              relations: { haoran: 10, yifan: -3 },
              health: -3,
              addFlags: ['c3_went_night_market'],
            },
            nextSceneId: 'c3-s3-out',
          },
          {
            id: 'c3-s2-c-yifan',
            label: '"我先看看书,改天。" 留宿舍',
            hint: '坦诚↑ 一帆信任↑ 浩然失望↓',
            effects: {
              tendencies: { honest: 5 },
              relations: { yifan: 10, haoran: -3 },
              addFlags: ['c3_stayed_in'],
            },
            nextSceneId: 'c3-s3-in',
          },
        ],
      },
    },
    {
      id: 'c3-s3-out',
      beats: [
        { id: 'c3-s3-out-b1', role: 'narration', text: '东门外那条街上,大排档的红色塑料灯一直亮到凌晨。烟、油、啤酒泡沫,一桌一桌地热闹。' },
        { id: 'c3-s3-out-b2', role: 'other', speaker: '王浩然', text: '来,走一个!以后机械三剑客!" ' },
        { id: 'c3-s3-out-b3', role: 'other', speaker: '罗展', text: '不是四剑客?' },
        { id: 'c3-s3-out-b4', role: 'other', speaker: '王浩然', text: '邓老师不喝,他算文剑客。' },
        { id: 'c3-s3-out-b5', role: 'narration', text: '许川端起杯子的那一刻,脑子里闪了一下八月十号那个圈红的日子,但只闪了一下。' },
        { id: 'c3-s3-out-b6', role: 'self', text: '今晚,先就一晚。' },
        { id: 'c3-s3-out-b7', role: 'narration', text: '玻璃杯"叮"地撞在一起。从这一晚开始,他和"普通男大学生"的剧本算是接上了头。' },
      ],
      nextSceneId: 'c3-end',
    },
    {
      id: 'c3-s3-in',
      beats: [
        { id: 'c3-s3-in-b1', role: 'narration', text: '宿舍门"咔"一声关上,王浩然的笑声在楼道里渐渐远了。' },
        { id: 'c3-s3-in-b2', role: 'narration', text: '邓一帆头也没抬:' },
        { id: 'c3-s3-in-b3', role: 'other', speaker: '邓一帆', text: '你也看?这本明天大概率讲。' },
        { id: 'c3-s3-in-b4', role: 'other', speaker: '许川', text: '看一会儿。' },
        { id: 'c3-s3-in-b5', role: 'narration', text: '俩人没怎么说话。台灯把两张桌子照成一小块亮的,书页翻动的声音和窗外远处的人声混在一起,意外地让人安心。' },
        { id: 'c3-s3-in-b6', role: 'self', text: '——也许大学不止一种过法。' },
      ],
      nextSceneId: 'c3-end',
    },
    {
      id: 'c3-end',
      beats: [
        { id: 'c3-end-b1', role: 'narration', text: '军训通知是凌晨发到群里的,"本周末开始,为期半个月"。' },
        { id: 'c3-end-b2', role: 'system', text: '——大学的第一关,要开始了。' },
      ],
    },
  ],
  outroLines: [
    { text: '宿舍这间屋子,以后会装下你太多说不出口的事。' },
    { whenFlag: 'c3_went_night_market', text: '王浩然把你存成了"川哥",从今晚开始。' },
    { whenFlag: 'c3_stayed_in', text: '邓一帆默默给你拷了一份明天的课件压缩包。' },
  ],
};
