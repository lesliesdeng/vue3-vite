<template>
  <div class="upload-modal">
    <el-dialog
      :title="title ? title : '文件上传'"
      v-model="dialogVisible"
      width="67%"
      append-to-body
      :close-on-click-modal="false"
      center
      destroy-on-close
    >
      <div class="upload-box">
        <el-upload
          multiple
          v-model:file-list="fileList"
          class="upload-demo"
          action=""
          :limit="10"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          list-type="picture"
          :before-upload="beforeAvatarUpload"
        >
          <el-button type="primary" plain>
            <el-icon><Upload /></el-icon>
            上传文件
          </el-button>
          <template #tip>
            <div class="upload-tip">
              支持jpg、png、gif、mp4、mov、mp3、wav等文件格式，不限制文件容量大小，单次导入不超过10个；
            </div>
          </template>
          <template #file="score">
            <div class="uplod-item">
              <div class="file-box">
                <img :src="score.file.Icon" />
                <span>{{ score.file.name }}</span>
              </div>
              <el-icon :size="16" @click="handleRemove(score.file)"><Delete /></el-icon>
            </div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirmClick">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'
import { useStore } from '@/store'

interface IUploadUserFile extends InstanceType<typeof UploadUserFile> {
  Icon: any
}

export default defineComponent({
  components: {},
  props: {
    title: {
      type: String
    },
    pageName: {
      type: String
    },
    folderId: {
      type: String
    }
  },
  setup(props) {
    const dialogVisible = ref(false)
    const store = useStore()
    // 上传成功文件列表
    const fileList = ref<IUploadUserFile[]>([])
    watch(dialogVisible, () => {
      fileList.value = []
    })
    const handleRemove = (uploadFile: IUploadUserFile) => {
      // 删除,不需调用接口
      fileList.value = fileList.value.filter((item: IUploadUserFile) => {
        return item.uid !== uploadFile.uid
      })
    }

    const handlePreview: InstanceType<typeof UploadProps>['onPreview'] = (file:any) => {
      console.log(file)
    }

    const handleExceed = (file: any) => {
      if (file.length + fileList.value.length > 10) {
        ElMessage.error('单次导入文件不得超过10个！')
      }
    }
    const handleConfirmClick = () => {
      if (fileList.value.length === 0) {
        ElMessage.error('请选择文件')
        return
      }
      const fileIds: any = []
      fileList.value.map((item: IUploadUserFile) => {
        fileIds.push(item.uid)
      })
      store
        .dispatch(`${props.pageName}/uploadComfirmAction`, {
          fileIds: fileIds.join(','),
          folderId: props.folderId
        })
        .then(() => {
          dialogVisible.value = false
        })
    }

    const getFileIcon = (file: IUploadUserFile) => {
      const nameArr = file.name.split('.')
      const fileName = nameArr[nameArr.length - 1].toLowerCase()
      const iconMap = {
        xls: 'xlsx',
        xlsx: 'xlsx',
        doc: 'docx',
        docx: 'docx',
        pdf: 'pdf',
        jpg: 'jpg',
        jpeg: 'jpg',
        png: 'png',
        mp3: 'mp3',
        mp4: 'mp4',
        avi: 'avi',
        mov: 'mov',
        gif: 'gif',
        wav: 'wav'
      }
      // return import.meta.glob(`@/assets/img/file-icon/${iconMap[fileName] ? iconMap[fileName] : iconMap['xls']}.png`, { eager: true })
    }

    const beforeAvatarUpload: InstanceType<typeof UploadProps>['beforeUpload'] = (rawFile:any) => {
      const nameArr = rawFile.name.split('.')
      if (
        !/(gif|jpg|jpeg|png|jpg|jpeg|png|mp3|mp4|mov|gif|wav)$/i.test(nameArr[nameArr.length - 1])
      ) {
        // 'xls,xlsx,doc,docx,pdf,jpg,jpeg,png,mp3,mp4,avi,mov,gif'
        ElMessage.error('仅支持jpg、png、gif、mp4、mov、mp3、wav文件格式')
        return false
      } else if (nameArr.slice(0, nameArr.length - 1).join().length > 50) {
        ElMessage.error('文件名不能超过50字符!')
        return false
      } else if (rawFile.size / 1024 / 1024 > 1024) {
        ElMessage.error('文件大小不能超过1G!')
        return false
      } else if (
        fileList.value.filter((item) => {
          return rawFile.name === item.name
        }).length !== 0
      ) {
        ElMessage.error(`已有文件名为${rawFile.name}的文件存在!`)
        return false
      }

      uploadFile(rawFile)
      return false
    }
    // 不使用组件http-request方法的原因：自定义uid；保存后台返回的id
    const uploadFile = (file: any) => {
      store
        .dispatch(`${props.pageName}/uploadFileAction`, { file: file, folderId: props.folderId })
        .then((res) => {
          // 上传成功加入展示队列
          const key = Object.keys(res)[0]
          fileList.value.push({
            name: key,
            uid: res[key],
            Icon: getFileIcon(file)
          })
          fileList.value = [...fileList.value]
        })
    }
    return {
      handleConfirmClick,
      dialogVisible,
      handleRemove,
      handlePreview,
      fileList,
      getFileIcon,
      beforeAvatarUpload,
      uploadFile,
      handleExceed
    }
  }
})
</script>

<style scoped lang="less">
.upload-box {
  padding: 10px 0;
  .upload-demo {
    .el-upload {
      .el-button {
        margin-bottom: 10px;
      }
    }
  }
}
.el-button {
  .el-icon {
    margin-right: 5px;
  }
}
@media screen and (min-width: 1600px) {
  .upload-tip {
    // postcss-px-to-viewport不会转换媒体查询中的px
    left: 9vw;
  }
}
@media screen and (max-width: 1600px) {
  .upload-tip {
    left: 10vw;
  }
}
.el-upload-list {
  max-height: 40vh;
  overflow: auto;
}
.upload-tip {
  font-size: 14px;
  color: #888888;
  position: absolute;
  top: 98px;
}
.uplod-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .file-box {
    display: flex;
    align-items: center;
    span {
      display: inline-block;
      width: 85%;
      font-size: 16px;
      color: #666666;
    }
    img {
      width: 30px;
      margin-right: 15px;
    }
  }
}
</style>
