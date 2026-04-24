import type { Chapter } from '../../types/novel';

export const chapter02: Chapter = {
  id: 'ch02',
  index: 2,
  title: '体检单上的阴影',
  subtitle: '复查这件事,他想拖到秋天',
  intro:
    '七月底,母亲开始往他手机里转一些"年轻人尿酸高的危险"。文章打开就是大字标题,配图全是老人的关节。',
  startSceneId: 'c2-s1',
  status: 'ready',
  scenes: [
    {
      id: 'c2-s1',
      beats: [
        { id: 'c2-s1-b1', role: 'narration', text: '微信置顶聊天里,母亲一天能发七八条。链接、截图、还有一段六十秒的语音。' },
        { id: 'c2-s1-b2', role: 'other', speaker: '母亲(语音)', text: '川啊,你那个尿酸的事妈又问了你舅,他说必须三个月内复查一次。你就抽个上午,医院你叔在那里。听见没?' },
        { id: 'c2-s1-b3', role: 'narration', text: '许川把手机扣在桌面上,听完那一段,顺手又翻过来,语音播到第三遍才耐着性子打了行字回过去。' },
        { id: 'c2-s1-b4', role: 'other', speaker: '许川', text: '知道了,我安排。' },
        { id: 'c2-s1-b5', role: 'self', text: '"安排"这两个字最好用——不是答应,也不是拒绝,把球踢回去而已。' },
      ],
      nextSceneId: 'c2-s2',
    },
    {
      id: 'c2-s2',
      beats: [
        { id: 'c2-s2-b1', role: 'narration', text: '志愿表填到一半,他偶尔会抬头看墙上的日历。母亲在日历上用红笔圈了八月十号,旁边写了两个字:复查。' },
        { id: 'c2-s2-b2', role: 'narration', text: '那两个字像两根刺,他每次抬头都得被扎一下。' },
        { id: 'c2-s2-b3', role: 'self', text: '去也行。' },
        { id: 'c2-s2-b4', role: 'self', text: '可"去"这件事一旦做了,就坐实了——他真的是个需要被复查的人。' },
      ],
      choice: {
        prompt: '八月十号要不要去抽这个血?',
        options: [
          {
            id: 'c2-s2-c-postpone',
            label: '编个理由,拖到开学之后再说',
            hint: '回避↑ 家人失望↑',
            effects: {
              tendencies: { avoidant: 8 },
              relations: { family: -6 },
              shame: 5,
              addFlags: ['c2_postponed'],
            },
            nextSceneId: 'c2-s3',
          },
          {
            id: 'c2-s2-c-go',
            label: '抽半天去县医院做了',
            hint: '坦诚↑ 健康轻微↑',
            effects: {
              tendencies: { honest: 8 },
              relations: { family: 5 },
              health: 3,
              addFlags: ['c2_did_followup'],
            },
            nextSceneId: 'c2-s3',
          },
        ],
      },
    },
    {
      id: 'c2-s3',
      beats: [
        { id: 'c2-s3-b1', role: 'narration', text: '夜里十一点,父亲从厂里回来。许川躺在床上没睡,听见客厅水龙头响,是父亲在洗手。' },
        { id: 'c2-s3-b2', role: 'narration', text: '过了一会儿,门外有人敲他房间门,"咚咚",两下,很轻。' },
        { id: 'c2-s3-b3', role: 'other', speaker: '父亲', text: '没睡?' },
        { id: 'c2-s3-b4', role: 'other', speaker: '许川', text: '没。' },
        { id: 'c2-s3-b5', role: 'narration', text: '父亲没进来,人在门外站着,只把头探了一下:' },
        { id: 'c2-s3-b6', role: 'other', speaker: '父亲', text: '你妈跟我说了。自己注意点。' },
        { id: 'c2-s3-b7', role: 'narration', text: '就这么一句,然后门"哒"一声合上了。' },
        { id: 'c2-s3-b8', role: 'self', text: '比挨骂还难受。' },
        { id: 'c2-s3-b9', role: 'self', text: '骂他还能顶回去,这种"自己注意点"——你连个还嘴的口子都找不到。' },
        { id: 'c2-s3-b10', role: 'system', text: '——他翻了个身,把脸埋进枕头里。' },
      ],
    },
  ],
  outroLines: [
    { text: '这一章里,他第一次意识到:有些事不是不告诉就不存在的。' },
    { whenFlag: 'c2_postponed', text: '八月十号那天,你去打了篮球。回家的时候,母亲在客厅坐着没说话。' },
    { whenFlag: 'c2_did_followup', text: '复查结果比想象中略好,母亲那晚多炒了一个菜。' },
  ],
};
