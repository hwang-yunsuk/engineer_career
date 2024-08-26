<template>
  <v-dialog
    v-model="showProfileConfirm"
    max-width="1200"
    max-height="600"
    persistent
    @keydown.esc="closeDialog"
  >
    <v-card title="エンジニア情報登録確認">
      <v-col class="d-flex" cols="12">
        <v-row>
          <v-col cols="1" class="pr-0 py-0">
            <v-sheet class="text-center meisho" color="cyan-darken-3" border>
              <sheet-footer>フリガナ</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="3" class="px-0 py-0">
            <v-sheet class="meisho" border>
              <sheet-footer>{{ userProfile.userNameFurikana }}</sheet-footer>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-row>
          <v-col cols="1" class="pr-0 py-0">
            <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
              <sheet-footer>氏名</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="3" class="px-0 py-0">
            <v-sheet class="meisho" border height="40px">
              <sheet-footer>{{ userProfile.userName }}</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="1" class="px-0 py-0">
            <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
              <sheet-footer>性別</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="1" class="px-0 py-0">
            <v-sheet class="meisho" border height="40px">
              <sheet-footer>{{ userProfile.userGender }}</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="1" class="px-0 py-0">
            <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
              <sheet-footer>生年月日</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-sheet class="meisho" border height="40px">
              <sheet-footer>{{ formatDateToYYYYMMDD(userProfile.userBirthdate) }}</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="1" class="px-0 py-0">
            <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
              <sheet-footer>年齢</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="1" class="px-0 py-0">
            <v-sheet class="meisho" border height="40px">
              <sheet-footer>{{ userProfile.userAge }}</sheet-footer>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-row>
          <v-col cols="1" class="pr-0 py-0">
            <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
              <sheet-footer>E-mail</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="3" class="px-0 py-0">
            <v-sheet class="meisho" border height="40px">
              <sheet-footer>{{ userProfile.userEmail }}</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="1" class="px-0 py-0">
            <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
              <sheet-footer>住所</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="6" class="px-0 py-0">
            <v-sheet class="meisho" border height="40px">
              <sheet-footer>{{ userProfile.userAdress }}</sheet-footer>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-row>
          <v-col cols="1" class="pr-0 py-0">
            <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
              <sheet-footer>最終学歴</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="10" class="px-0 py-0">
            <v-sheet class="meisho" border height="40px">
              <sheet-footer>{{ userProfile.userEducation }}</sheet-footer>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-row>
          <v-col cols="1" class="pr-0 py-0">
            <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
              <sheet-footer>取得資格</sheet-footer>
            </v-sheet>
          </v-col>
          <v-col cols="10" class="px-0 py-0">
            <v-sheet class="meisho" border height="40px">
              <sheet-footer>{{ arrayToCommaValue(userProfile.licenses) }}</sheet-footer>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
      <!-- 詳細項目を繰り返し表示 -->
      <div v-for="(detail, index) in userProfileDetail" :key="index">
        <v-col class="pl-6">No.{{ detail.no }}</v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
                <sheet-footer>期間</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="3" class="px-0 py-0">
              <v-sheet class="meisho" border height="40px">
                <sheet-footer>{{ detail.startDate }}</sheet-footer>
                <sheet-footer> 〜 </sheet-footer>
                <sheet-footer>{{ detail.endDate }}</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="1" class="px-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
                <sheet-footer>月数</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="1" class="px-0 py-0">
              <v-sheet class="meisho" border height="40px">
                <sheet-footer>{{ detail.monthOfNumber }}</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="1" class="px-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
                <sheet-footer>業種</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="4" class="px-0 py-0">
              <v-sheet class="meisho" border height="40px">
                <sheet-footer>{{ detail.businessCategory }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="80px">
                <sheet-footer>システム名</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="3" class="px-0 py-0">
              <v-sheet class="meisho" border height="80px">
                <sheet-footer>{{ detail.systemName }}</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="1" class="px-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="80px">
                <sheet-footer>業務・作業内容</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="6" class="px-0 py-0">
              <v-sheet class="meisho" border height="80px" style="overflow-y: auto">
                <sheet-footer class="text-pre-line">{{ detail.workDetails }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
                <sheet-footer>OS</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="10" class="px-0 py-0">
              <v-sheet class="meisho" border height="40px">
                <sheet-footer>{{ arrayToCommaString(detail.osTypeOption) }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
                <sheet-footer>DB</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="10" class="px-0 py-0">
              <v-sheet class="meisho" border height="40px">
                <sheet-footer>{{ arrayToCommaString(detail.dbTypeOption) }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="50px">
                <sheet-footer>開発言語 / ツール</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="10" class="px-0 py-0">
              <v-sheet class="meisho" border height="50px">
                <sheet-footer>{{ arrayToCommaString(detail.developmentTypeOption) }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet
                class="text-center checkbox-meisho"
                color="cyan-darken-3"
                border
                height="110px"
              >
                <sheet-footer>担当工程 / 担当</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="10" class="px-0 py-0">
              <v-sheet class="meisho" border height="110px">
                <v-row>
                  <v-col
                    v-for="(optionType, typeName) in projectPhaseList"
                    :key="typeName"
                    class="mb-7"
                  >
                    <h5>{{ optionType.type }}</h5>
                    <v-row>
                      <v-col
                        cols="4"
                        class="py-0"
                        v-for="item in optionType.examples"
                        :key="item.name"
                      >
                        <v-checkbox
                          class="custom-checkbox"
                          :label="item"
                          :value="item"
                          :model-value="detail.projectPhaseTypeOption"
                          hide-details
                          disabled
                          dense
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="80px">
                <sheet-footer>備考</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="10" class="px-0 py-0">
              <v-sheet class="meisho" border height="80px" style="overflow-y: auto">
                <sheet-footer class="text-pre-line">{{ detail.comment }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
      </div>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn
          class="ma-4"
          text="登録"
          color="primary"
          variant="outlined"
          @click="hanldleSubmit"
        ></v-btn>
        <v-btn
          class="ma-4"
          text="キャンセル"
          color="error"
          variant="outlined"
          @click="closeDialog"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { projectPhase } from '@/const.js'
import { formatDateToYYYYMMDD } from '@/utils/dateFormater'
import { arrayToCommaValue, arrayToCommaString } from '@/utils/arrayToString'

const props = defineProps({
  userProfileList: {
    type: Object,
    default: () => {}
  },
  dialog: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['hanldleSubmit'], ['closeDialog'])

const showProfileConfirm = ref(props.dialog)
const userProfile = ref(props.userProfileList)

watch(
  () => props.dialog,
  (newVal) => {
    showProfileConfirm.value = newVal
  }
)

// 担当工程の選択肢を配列に設定
const projectPhaseList = computed(() => Object.values(projectPhase))
const userProfileDetail = computed(() => userProfile.value.userDetailList)

const closeDialog = () => {
  showProfileConfirm.value = false
  emit('closeDialog')
}

const hanldleSubmit = () => {
  // 登録処理などを行う
  emit('hanldleSubmit')
}
</script>

<style scoped>
.meisho {
  align-content: center;
}
.checkbox-meisho {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.custom-checkbox {
  height: 25px !important; /* チェックボックス全体の高さを調整 */
}
.text-pre-line {
  white-space: pre-line;
}
</style>
