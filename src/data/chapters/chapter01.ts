import type { Chapter } from '../../types/novel';

export const chapter01: Chapter = {
  id: 'ch01',
  index: 1,
  title: '高考结束的夏天',
  subtitle: '县城,蝉,体检报告',
  intro:
    '七月的县城像一口蒸笼。十八岁的许川刚把高考甩在身后,以为整个夏天都是自己的——直到那张体检单从抽屉里翻了出来。',
  startSceneId: 'c1-s1',
  status: 'ready',
  scenes: [
    {
      id: 'c1-s1',
      beats: [
        { id: 'c1-s1-b1', role: 'narration', text: '出租车从汽车站一路晃回家,司机一边按喇叭一边骂前面的电瓶车,空调坏了,玻璃只摇下来一道缝。' },
        { id: 'c1-s1-b2', role: 'narration', text: '车里全是蒸出来的汗味和柴油味。许川半个身子靠在车门上,脑子里还在嗡嗡地响——不是想题,是单纯的空。' },
        { id: 'c1-s1-b3', role: 'self', text: '考完了。'},
        { id: 'c1-s1-b4', role: 'self', text: '这三个字在心里反复翻,翻到后来自己都觉得没什么实感。' },
        { id: 'c1-s1-b5', role: 'other', speaker: '司机', text: '小伙子高考完啊?看你这架势,考得不错吧?' },
        { id: 'c1-s1-b6', role: 'other', speaker: '许川', text: '还行。' },
        { id: 'c1-s1-b7', role: 'narration', text: '他没想多聊。司机咂了下嘴,也就没再问。' },
        { id: 'c1-s1-b8', role: 'narration', text: '到家时是下午三点,小区门口的法桐被晒得叶子都打了卷,门卫在传达室里光着膀子吹风扇。许川提着行李上楼,六楼,没电梯。爬到四楼的时候,他停下来缓了一口气,觉得腿有点酸——比他记忆里要酸得早。' },
      ],
      nextSceneId: 'c1-s2',
    },
    {
      id: 'c1-s2',
      beats: [
        { id: 'c1-s2-b1', role: 'narration', text: '推门进去,屋里飘着葱花炝锅的味儿。母亲在厨房,听见动静探出头来,围裙上沾着一道酱油痕。' },
        { id: 'c1-s2-b2', role: 'other', speaker: '母亲', text: '回来啦?快洗手,马上吃饭。' },
        { id: 'c1-s2-b3', role: 'narration', text: '父亲不在,大概又是厂里。许川丢下行李,进厨房洗手。母亲背对着他切菜,菜刀剁在案板上一声一声,听着像在憋话。' },
        { id: 'c1-s2-b4', role: 'other', speaker: '母亲', text: '体检结果出来了吧?学校发了没?' },
        { id: 'c1-s2-b5', role: 'self', text: '果然。' },
        { id: 'c1-s2-b6', role: 'self', text: '他从背包侧袋里摸到那张折了一道的报告单,边上"尿酸偏高,建议复查"几个字被他自己用拇指压得发亮。' },
      ],
      choice: {
        prompt: '母亲在等你说话。',
        options: [
          {
            id: 'c1-s2-c-defer',
            label: '"没事,都正常。"',
            hint: '硬撑↑ 家人信任↓',
            effects: {
              tendencies: { defiant: 8 },
              relations: { family: -3 },
              addFlags: ['c1_lied_to_mother'],
            },
            nextSceneId: 'c1-s3',
          },
          {
            id: 'c1-s2-c-honest',
            label: '"医生说尿酸有点高,让复查一下。"',
            hint: '坦诚↑ 家人关心↑',
            effects: {
              tendencies: { honest: 8 },
              relations: { family: 6 },
              addFlags: ['c1_told_mother'],
            },
            nextSceneId: 'c1-s3',
          },
        ],
      },
    },
    {
      id: 'c1-s3',
      beats: [
        { id: 'c1-s3-b1', role: 'narration', text: '吃完饭,父亲还没回来。许川回房间,把行李扔在床上没拆,一个人坐在书桌前。' },
        { id: 'c1-s3-b2', role: 'narration', text: '窗外蝉叫得没完没了,旧空调挂在墙上嗡嗡转,出风口对着他后脑勺。他从背包里把那张体检单又掏出来,平摊在桌面上。' },
        { id: 'c1-s3-b3', role: 'narration', text: '"尿酸偏高,建议三月内复查。"' },
        { id: 'c1-s3-b4', role: 'self', text: '才十八。' },
        { id: 'c1-s3-b5', role: 'self', text: '这种东西不该是中年人的事吗。' },
        { id: 'c1-s3-b6', role: 'narration', text: '他想起爸——那个常年把"忍忍就过去了"挂在嘴边的男人,腰、膝盖、脚背,哪儿都旧。许川下意识地把那张纸又对折了一下。' },
      ],
      choice: {
        prompt: '怎么处理这张报告?',
        options: [
          {
            id: 'c1-s3-c-hide',
            label: '折两下,顺手塞进抽屉箱底',
            hint: '回避↑ 羞耻↑',
            effects: {
              tendencies: { avoidant: 8 },
              shame: 5,
              addFlags: ['c1_hid_report'],
            },
            nextSceneId: 'c1-end',
          },
          {
            id: 'c1-s3-c-snap',
            label: '拍张照存手机,设个三个月后的提醒',
            hint: '坦诚↑ 隐性健康收益',
            effects: {
              tendencies: { honest: 6 },
              health: 2,
              addFlags: ['c1_set_reminder'],
            },
            nextSceneId: 'c1-end',
          },
        ],
      },
    },
    {
      id: 'c1-end',
      beats: [
        { id: 'c1-end-b1', role: 'narration', text: '楼下有人放鞭炮,大概是哪家也有孩子高考结束。许川把灯关了,躺到床上。' },
        { id: 'c1-end-b2', role: 'narration', text: '明天开始,他得想想填志愿的事;再过两个月,他就要离开这个城市,去一个谁也不认识他的地方。' },
        { id: 'c1-end-b3', role: 'self', text: '到那时候,这些破事就跟我没关系了。' },
        { id: 'c1-end-b4', role: 'system', text: '——他这么想着,睡了过去。' },
      ],
    },
  ],
  outroLines: [
    { text: '夏天还很长,他第一次有"自己说了算"的错觉。' },
    { whenFlag: 'c1_lied_to_mother', text: '母亲那晚在厨房又站了很久,你没看见。' },
    { whenFlag: 'c1_told_mother', text: '母亲连夜在手机上搜了"尿酸偏高怎么办",收藏了七篇文章。' },
    { whenFlag: 'c1_hid_report', text: '那张报告单后来一直在抽屉最底下。' },
    { whenFlag: 'c1_set_reminder', text: '三个月后的那个下午,你的手机会响。' },
  ],
};
