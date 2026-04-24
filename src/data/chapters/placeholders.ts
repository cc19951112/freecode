import type { Chapter } from '../../types/novel';

// 5-15 章占位:暂时不写正文,只放标题与一句引语,供章节列表展示。
// reader 在遇到 status='placeholder' 时,intro 后直接收尾,不进入正文。

function placeholder(
  index: number,
  title: string,
  subtitle: string,
  intro: string
): Chapter {
  return {
    id: `ch${String(index).padStart(2, '0')}`,
    index,
    title,
    subtitle,
    intro,
    scenes: [],
    startSceneId: '',
    status: 'placeholder',
  };
}

export const placeholderChapters: Chapter[] = [
  placeholder(
    5,
    '他开始发光',
    '一次比赛,一次被注意到',
    '他第一次觉得,自己是被人需要的。这种感觉比任何一次解题都让人上瘾。'
  ),
  placeholder(
    6,
    '恋爱像一台新启动的机器',
    '靠近沈知遥的那段日子',
    '没有教程,只能边运转边修。'
  ),
  placeholder(
    7,
    '项目、酒局与侥幸',
    '"再喝最后一杯"',
    '他以为身体已经熬过最坏的时候,其实它只是在等下一次。'
  ),
  placeholder(
    8,
    '医生把未来讲清楚',
    '复查,与一份不愿听见的提示',
    '"年轻不是免死金牌。"——他第一次觉得这句话是冲他说的。'
  ),
  placeholder(
    9,
    '错过的第一次机会',
    '一次发作,一次失约',
    '世界没等他。'
  ),
  placeholder(
    10,
    '硬撑的人不会承认自己在下坠',
    '深夜实验室,白天打卡',
    '所有问题都被他按到水面以下,他以为按住就是解决。'
  ),
  placeholder(
    11,
    '家庭战争',
    '一通电话,一场旧账',
    '父亲和他终于把那些没说出口的东西,用最难听的方式讲了出来。'
  ),
  placeholder(
    12,
    '感情崩口',
    '不是因为生病,是因为隐瞒',
    '沈知遥说的不是分手,是"我累了"。'
  ),
  placeholder(
    13,
    '毕业季崩盘',
    '答辩前夜,身体先认输',
    '他终于知道,有些极限不是靠咬牙能跨过去的。'
  ),
  placeholder(
    14,
    '父与子',
    '回家那几天,父亲比平时更沉默',
    '父亲递过来的那杯水里,有他从没听过的话。'
  ),
  placeholder(
    15,
    '带着限制重新出发',
    '不是大团圆,是一种新的开始',
    '他终于学会用自己的方式活下去,而不是和别人比着活。'
  ),
];
