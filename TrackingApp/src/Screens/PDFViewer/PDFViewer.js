import React,{useState} from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity,PermissionsAndroid } from 'react-native';
import {useNavigation} from '../../config/useNavigation.js';
import { Icon } from "react-native-elements";
import RNFetchBlob from "rn-fetch-blob";
import {withCustomerToaster}    from '../../redux/AppState.js';
import {useDispatch}            from 'react-redux';
import { NavigationActions}  from 'react-navigation';
import ProgressCircle from 'react-native-progress/Circle';
import { colors, sizes }        from '../../config/styles.js';
 
import Pdf from 'react-native-pdf';
const window = Dimensions.get("window");
 export const PDFViewer = withCustomerToaster(props => {
     
        const navigation = useNavigation();
        const dispatch          = useDispatch();
        var path   = navigation.getParam('path');
        const source = {uri:path,cache:true};
        const [loading,setLoading]=useState(false);
        const [progress,setProgress]=useState(0);

        const downloadPDF = async () => {
            console.log("aaa")
          if (Platform.OS === "android") {
            const granted = await getPermissionAndroid();
            if (!granted) {
              return;
            }
          }
          setLoading(true);
          let date = new Date();
          let image_URL = path;
          let ext = getExtention(path);
          ext = "." + ext[0];
          const { config, fs } = RNFetchBlob;
          let PictureDir = fs.dirs.PictureDir;
        //   let options = {
        //     fileCache: true,
        //     addAndroidDownloads: {
        //       // Related to the Android only
        //       useDownloadManager: true,
        //       notification: true,
        //       // title : 'Great ! Download Success !',
        //       path:
        //         PictureDir +
        //         "/pdf_" +
        //         Math.floor(date.getTime() + date.getSeconds() / 2) +
        //         ext,
        //       description: "Image",
        //     },
        //   };
        //   config(options)
        RNFetchBlob.fetch("GET", image_URL)
            .progress({ count : 10 }, (received, total) => {
              setProgress(received / total)
            })
            .then((res) => {
              setLoading(false);
              setProgress(0);
              console.log("res -> ", JSON.stringify(res));
              navigation.dispatch(NavigationActions.back())
              props.setToast({text: "PDF Downloaded Successfully", color: "green" });
            })
            .catch(err=>{
              console.log("err",err);
            });
        };
        const getExtention = (filename) => {
          // To get the file extension
          return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
        };
      

        const getPermissionAndroid = async () => {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: "PDF Download Permission",
                  message: "Your permission is required to save PDF to your device",
                  buttonNegative: "Cancel",
                  buttonPositive: "OK",
                }
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
              }
              Alert.alert(
                "Save remote PDF",
                "Grant Me Permission to save PDF",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            } catch (err) {
              Alert.alert(
                "Save remote PDF",
                "Failed to save PDF: " + err.message,
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            }
          };
 
        return (
            <View style={styles.container}>
                <View
                    style={ {
                    flexDirection: "row",
                    height: 45,
                    alignItems: "center",
                    padding: `${2}%`,
                    justifyContent: "space-between",
                    } }
                >
                    <TouchableOpacity onPress={()=>navigation.dispatch(NavigationActions.back())}>
                    <Icon
                        color={colors.theme}
                        size={ 22 }
                        name="chevron-left"
                        type="entypo"
                    />
                    </TouchableOpacity>
                    <View style={{flexDirection:"row"}}>
                    <TouchableOpacity onPress={ () => downloadPDF() }>
                        <Icon color={colors.theme} size={ 22 } name="file-download"  />
                    </TouchableOpacity>
                    {/*  <TouchableOpacity onPress={ () => shareImage() }>
                        <Icon color={ "#fff" } size={ 22 } name="share"  />
                    </TouchableOpacity> */}
                    </View>
                </View>
                {!loading? <Pdf
                    source={source}
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
        )
  })
 
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