import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'
export default function ExpandableContent({subContent,mainContent}){
    const [isExpanded,setIsExpanded] = useState(false)
    return <View style={{width : '100%'}}>
        {mainContent}
        {!isExpanded && <TouchableOpacity style={{alignItems : 'center', padding : 5 ,alignSelf : 'stretch'}} onPress={()=>{setIsExpanded(!isExpanded)}}>
            <Icon name='arrow-down' color='black' size={25} />
        </TouchableOpacity>}
        {isExpanded && <View>
                {subContent}
                <TouchableOpacity style={{alignItems : 'center', padding : 5 ,alignSelf : 'stretch'}} onPress={()=>{setIsExpanded(!isExpanded)}}>
            <Icon name='arrow-up' color='black' size={25} />
        </TouchableOpacity>
            </View>

        }
    </View>
}