import React,{useState} from "react";
import {
  Alert,
  Dimensions,
  Modal,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  View,
  Image,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Share            from "react-native-share";
import RNFetchBlob      from "rn-fetch-blob";
import { Icon }         from "react-native-elements";
import ImageZoom        from 'react-native-image-pan-zoom';
import ProgressCircle   from 'react-native-progress/Circle';
import { colors}        from '../../config/styles.js';
import Pdf              from 'react-native-pdf';

const window = Dimensions.get("window");

export const DownloadModal = ({ visible, close, url, setToast }) => {
  console.log("url",url);
  const [loading,setLoading]    = useState(false)
  const [progress,setProgress]  = useState(0)
  const shareImage = () => {
    RNFetchBlob.fetch("get", url)
      .then((res) => {
        let base64 = res.data;
        share("data:image/jpeg;base64," + base64);
      })
      .catch((err) => {
        console.log("errir", err);
      });
  };

  const share = async (base64) => {
    const shareOptions = {
      url: base64,
      message: "",
      title: ``,
      type: "image/jpg",
      activityItemSources: [
        {
          linkMetadata: { image: base64 },
        },
      ],
      failOnCancel: false,
    };
    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log("share response", ShareResponse);
      return close();
    } catch (error) {
      console.log("Error =>", error);
      return close();
    }
  };

  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Image Download Permission",
          message: "Your permission is required to save images to your device",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        "Save remote Image",
        "Grant Me Permission to save Image",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } catch (err) {
      Alert.alert(
        "Save remote Image",
        "Failed to save Image: " + err.message,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  };

  const download = async () => {
      console.log("aaa")
    if (Platform.OS === "android") {
      const granted = await getPermissionAndroid();
      if (!granted) {
        return;
      }
    }
    setLoading(true);
    let date = new Date();
    var ext = getExtention(url);
    console.log("ext",ext);
    ext = "." + ext[0];
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        // title : 'Great ! Download Success !',
        path: ext=="pdf" || ext=="xls" || ext=="PDF" || ext=="XLS" ?
          PictureDir +
          "/file_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext:
          PictureDir +
          "/image_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext
          ,
        description: "Image",
      },
    };
    console.log("ext",ext);
    // config(options)
    RNFetchBlob.fetch("GET", url)
      .progress({ count : 10 }, (received, total) => {
        setProgress(received / total)
      })
      .then((res) => {
        setLoading(false);
        setProgress(0);
        if(ext === ".pdf" || ext === ".PDF"){
          setToast({text: "PDF Downloaded Successfully", color: "green" });
        }else if(ext === ".xls" || ext === ".XLS"){
          setToast({text: "Excel Downloaded Successfully", color: "green" });
        }else{
          setToast({text: "Image Downloaded Successfully", color: "green" });
        }
        return close();
      })
      .catch(err=>{
        console.log("err",err);
      });
  };
  const getExtention = (filename) => {
    console.log("Filename",filename)
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  let ext = getExtention(url);


    return (
      <Modal visible={ visible } onRequestClose={ close } onDismiss={ close }>
        <SafeAreaView style={ { flex: 1 } }>
          <View style={ { flex: 1, justifyContent: "space-between", backgroundColor: "#111" } }>
            <View
              style={ {
                flexDirection: "row",
                height: 45,
                alignItems: "center",
                padding: `${2}%`,
                justifyContent: "space-between",
                marginTop:`${2}%`
              } }
            >
              <TouchableOpacity onPress={close}>
                <Icon
                  color={ "#fff" }
                  size={ 25 }
                  name="chevron-left"
                  type="entypo"
                />
              </TouchableOpacity>
              <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={ () => download() } style={{height:50,width:50,justifyContent:"center",alignItems:"flex-end"}}>
                  <Icon color={ "#fff" } size={ 25 } name="file-download"  />
                </TouchableOpacity>
              {/*  <TouchableOpacity onPress={ () => shareImage() }>
                  <Icon color={ "#fff" } size={ 22 } name="share"  />
                </TouchableOpacity> */}
              </View>
            </View> 
              {ext && (ext[0]=="pdf" || ext[0]=="PDF") ?
              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}> 
                {!loading? <Pdf
                source={{uri:url,cache:true}}
                onLoadComplete={(numberOfPages,filePath)=>{
                    console.log(`number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page,numberOfPages)=>{
                    console.log(`current page: ${page}`);
                }}
                onError={(error)=>{
                    console.log(error);
                }}
                onPressLink={(uri)=>{
                    console.log(`Link presse: ${uri}`)
                }}
                style={styles.pdf}/>
                :
                  <ProgressCircle   textStyle={{ fontSize: 10 }}
                    showsText={true}
                    progress={progress}
                    size={100}
                    color={colors.theme}
                    thickness={2}
                    style={{alignSelf:"center"}}
                    />
            }
            </View>  
            :
            ext && (ext[0]=="xls" || ext[0]=="XLS")?
            <View  style={{flex:1,justifyContent:'center',}}>
                {!loading?<Image
                  resizeMode="contain"
                  style={ { height: 200 ,width:200,alignSelf:"center" } }
                  source={require('../../images/xls.png')}
                />
                :
                <View style={{height:window.height * 0.7,width:window.width,justifyContent:'center'}}>
                  <ProgressCircle   textStyle={{ fontSize: 10 }}
                    showsText={true}
                    progress={progress}
                    size={100}
                    color={colors.theme}
                    thickness={2}
                    style={{alignSelf:"center"}}
                    />
                </View> }
            </View>
            :
            <View style={ { paddingVertical: `${5}%` } }>
            <ImageZoom cropWidth={Dimensions.get('window').width}
                        cropHeight={Dimensions.get('window').height}
                        imageHeight={Dimensions.get('window').height}
                        imageWidth={Dimensions.get('window').width}>
                {!loading?<Image
                  resizeMode="contain"
                  style={ { height: window.height * 0.7 } }
                  source={ { uri: url } }
                />
                :
                <View style={{height:window.height * 0.7,width:window.width,justifyContent:'center'}}>
                  <ProgressCircle   textStyle={{ fontSize: 10 }}
                    showsText={true}
                    progress={progress}
                    size={100}
                    color={colors.theme}
                    thickness={2}
                    style={{alignSelf:"center"}}
                    />
                </View> }
            </ImageZoom>
            </View>
          }
          </View>
        </SafeAreaView>
      </Modal>
    );
};
const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop: 25,
  },
  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
  }
})