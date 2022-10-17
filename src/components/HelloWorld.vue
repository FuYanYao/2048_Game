<template>
  <div class="common-layout">
    <el-container class="home-container">
      <el-header>
        <div class="header-div">
          <h1>2048</h1>
        </div>
        <div class="header-grade">
          <el-card class="grade1">分数:{{ goard }}</el-card>
          <el-card class="grade2">最佳:{{ bestgoard }}</el-card>
        </div>
      </el-header>
      <el-main v-touch:swipe.left="swipeLeft" v-touch:swipe.right="swipeRight" v-touch:swipe.top="swipeTop"
        v-touch:swipe.bottom="swipeDown">
        <el-card class="game-ui">
          <template #header>
            <div class="card-header">
              <span>努力合成2048!!!</span>
              <el-button @click="reset" class="re-button" type="warning" plain :icon="Refresh">重新开始</el-button>
            </div>
          </template>
          <el-row v-for="(m, i) in modelList" :key="i">
            <el-col :span="6" v-for="(sm, si) in modelList[i]" :key="si">
              <el-card :style="changeColor(sm)" class="little-block">
                <h2 :style="activeh2(sm)" align="center">{{ sm===0 ? '' : sm }}</h2>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-main>
    </el-container>
    <el-dialog width="35%" title="已经结束了" v-model="badDialogVisible">
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="badClose">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
export default {
  setup() {
    const goard = ref(0)
    const bestgoard = ref(0)
    const modelList = ref([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ])
    const canMoveFlagList = ref([
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],

    ])
    const gameModel = reactive({
      0: '#F5DEB3',
      2: '#FFE4B5',
      4: '#FFA07A',
      8: '#FA8072',
      16: '#BDB76B',
      32: '#ADFF2F',
      64: '#20B2AA',
      128: '#4169E1',
      256: '#BA55D3',
      512: '#F4A460',
      1024: '#DAA520',
      2048: '#A52A2A'
    })
    const judgeWinFlag = ref(false)
    const badDialogVisible = ref(false)
    const judgeBadFlag = ref(false)
    return {
      Refresh, modelList, gameModel, goard, bestgoard,
      judgeWinFlag, canMoveFlagList, badDialogVisible,
      judgeBadFlag
    }
  },
  methods: {
    reset() {
      this.modelList = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
      this.goard = 0
    },
    keyDown() {
      document.onkeydown = (e) => {
        let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
        //左箭头-37;上箭头-38；右箭头-39;下箭头-40
        if (e1 && e1.keyCode == 37) {
          this.allOpt('left')
        } else if (e1 && e1.keyCode == 39) {
          this.allOpt('right')
        } else if (e1 && e1.keyCode == 38) {
          this.allOpt('top')
        } else if (e1 && e1.keyCode == 40) {
          this.allOpt('down')
        }
      }
    },
    getWiteNum() {
      let i = 0
      this.modelList.forEach(sc => {
        sc.forEach(element => {
          if (element === 0) { i++ }
        })
      })
      return i
    },
    makeRandBlock() {
      let i = Math.floor(Math.random() * this.getWiteNum())
      let j = 0
      let o = 0
      let k = 0
      this.modelList.forEach(sc => {
        sc.forEach((element) => {
          if (element === 0) {
            if (j === i) {
              k = k % 4
              // console.log(o, k);
              this.modelList[o][k] = 2
            }
            j++
          }
          k++
        })
        o++
      })
    },
    leftMove(a, b) {
      if (b === 0) return
      if (this.modelList[a][b] === 0) return
      if (this.modelList[a][b - 1] === 0) {
        if (this.canMoveFlagList[a][b]) {
          this.canMoveFlagList[a][b] = false
          this.canMoveFlagList[a][b - 1] = true
        }
        this.modelList[a][b - 1] = this.modelList[a][b]
        this.modelList[a][b] = 0
      } else if (this.modelList[a][b - 1] === this.modelList[a][b]) {
        if (!this.canMoveFlagList[a][b - 1] && !this.canMoveFlagList[a][b]) {
          this.modelList[a][b - 1] *= 2
          this.goard += this.modelList[a][b]
          this.modelList[a][b] = 0
          this.canMoveFlagList[a][b - 1] = true
        }
      }
    },
    upMove(a, b) {
      if (a === 0) return
      if (this.modelList[a][b] === 0) return
      if (this.modelList[a - 1][b] === 0) {
        if (this.canMoveFlagList[a][b]) {
          this.canMoveFlagList[a][b] = false
          this.canMoveFlagList[a - 1][b] = true
        }
        this.modelList[a - 1][b] = this.modelList[a][b]
        this.modelList[a][b] = 0
      } else if (this.modelList[a - 1][b] === this.modelList[a][b]) {
        if (!this.canMoveFlagList[a][b - 1] && !this.canMoveFlagList[a][b]) {
          this.modelList[a - 1][b] *= 2
          this.goard += this.modelList[a][b]
          this.modelList[a][b] = 0
          this.canMoveFlagList[a - 1][b] = true
        }
      }
    },
    downMove(a, b) {
      if (a === 3) return
      if (this.modelList[a][b] === 0) return
      if (this.modelList[a + 1][b] === 0) {
        if (this.canMoveFlagList[a][b]) {
          this.canMoveFlagList[a][b] = false
          this.canMoveFlagList[a + 1][b] = true
        }
        this.modelList[a + 1][b] = this.modelList[a][b]
        this.modelList[a][b] = 0
      } else if (this.modelList[a + 1][b] === this.modelList[a][b]) {
        if (!this.canMoveFlagList[a + 1][b] && !this.canMoveFlagList[a][b]) {
          this.modelList[a + 1][b] *= 2
          this.goard += this.modelList[a][b]
          this.modelList[a][b] = 0
          this.canMoveFlagList[a + 1][b] = true
        }
      }
    },
    rightMove(a, b) {
      if (b === 3) return
      if (this.modelList[a][b] === 0) return
      if (this.modelList[a][b + 1] === 0) {
        if (this.canMoveFlagList[a][b]) {
          this.canMoveFlagList[a][b] = false
          this.canMoveFlagList[a][b + 1] = true
        }
        this.modelList[a][b + 1] = this.modelList[a][b]
        this.modelList[a][b] = 0
      } else if (this.modelList[a][b + 1] === this.modelList[a][b]) {
        if (!this.canMoveFlagList[a][b + 1] && !this.canMoveFlagList[a][b]) {
          this.modelList[a][b + 1] *= 2
          this.goard += this.modelList[a][b]
          this.modelList[a][b] = 0
          this.canMoveFlagList[a][b + 1] = true
        }
      }
    },
    allOpt(_type) {
      if (_type === 'left' || _type === 'top') {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
              if (_type === 'left') {
                this.leftMove(j, k)
              } else if (_type === 'top') {
                this.upMove(j, k)
              }
            }
          }
        }
      } else {
        for (let i = 0; i < 4; i++) {
          for (let j = 3; j >= 0; j--) {
            for (let k = 3; k >= 0; k--) {
              if (_type === 'right') {
                this.rightMove(j, k)
              } else {
                this.downMove(j, k)
              }
            }
          }
        }
      }
      this.makeRandBlock()
      if (this.bestgoard < this.goard) {
        this.bestgoard = this.goard
      }
      this.judgeWin()
      this.judgeBad()
      this.canMoveFlagList = [[false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false],]
    },
    changeColor(sm) {
      return {
        'background-color': this.gameModel[sm]
      }
    },
    judgeWin() {
      this.modelList.forEach(sc => {
        if (!this.judgeWinFlag) {
          if (sc.includes(2048)) {
            ElMessage.success('恭喜您合成了2048')
            this.judgeWinFlag = true
          }
        }
      })
    },
    activeh2(sm) {
      if (sm > 1000) return { 'transform': 'translate(-24%, -60%)' }
      if (sm > 100) return { 'transform': 'translate(-6%, -60%)' }
      return { 'transform': 'translate(0, -60%)' }
    },
    judgeBad() {
      let badNum = 0
      for (let a = 0; a < 4; a++) {
        for (let b = 0; b < 4; b++) {
          if (this.modelList[a][b] === 0) continue
          if (a !== 3 && this.modelList[a][b] === this.modelList[a + 1][b]) continue
          if (a !== 0 && this.modelList[a][b] === this.modelList[a - 1][b]) continue
          if (b !== 3 && this.modelList[a][b] === this.modelList[a][b + 1]) continue
          if (b !== 0 && this.modelList[a][b] === this.modelList[a][b - 1]) continue
          badNum++
        }
      }
      if (badNum === 16) {
        this.badDialogVisible = true
      }
    },
    badClose() {
      this.badDialogVisible = false
    },
    swipeLeft() {
      this.allOpt('left')
    },
    swipeRight() {
      this.allOpt('right')
    },
    swipeTop() {
      this.allOpt('top')
    },
    swipeDown() {
      this.allOpt('down')
    }
  },
  mounted() {
    this.keyDown()
  }
}
</script>

<style scoped>
.little-block {
  height: 120px;
  margin: 13px;
  background-color: #F5DEB3 var(--el-card-padding)=0
}

.common-layout,
.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  background-color: #99BCAC;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 14px;
  width: 100%;
  height: 15%;
  margin-top: 8px;
}

.el-header h1 {
  width: 200px;
  font-size: 70px;
}

.el-main {
  background-color: #99BCAC;
}

.grade1,
.grade2 {
  margin-bottom: 8px;
  width: 120px;
  --el-card-padding: 11px
}

.game-ui {
  width: 650px;
  height: 680px;
  background-color: #80A492;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  clear: both;
  margin-top: 50px;
  border-color: #B1D5CB;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.re-button {
  border: 0;
  position: absolute;
  right: 20px;
  /* background-color: #E18A3B; */
  overflow: hidden;
  clear: both;
}

h2 {
  font-size: 50px;
  transform: translate(0, -60%);
}

@media screen and (min-width:992px) {
  .header-div {
    position: relative;
    left: 38%;
  }

  .header-grade {
    position: absolute;
    left: 38%;
    transform: translate(200px, 0);
  }
}

@media screen and (min-width:768px) and (max-width:992px) {
  .little-block {
    height: 100px
  }

  .header-div {
    position: relative;
    left: 28%;
  }

  h2 {
    font-size: 35px;
  }

  .header-grade {
    position: absolute;
    left: 28%;
    transform: translate(200px, 0);
  }

  .game-ui {
    width: 550px;
    height: 600px;
  }
}

@media screen and (max-width:768px) {
  .little-block {
    height: 65px;
    margin: 5px;
  }

  .header-div {
    position: relative;
    left: 8%;
  }

  h2 {
    font-size: 18px;
    transform: translate(0, -70%);
  }

  .header-grade {
    position: absolute;
    left: 8%;
    transform: translate(200px, 0);
  }

  .game-ui {
    margin-top: 0;
    width: 350px;
    height: 400px;
  }
}
</style>
