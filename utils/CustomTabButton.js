import React from 'react';
import { Pressable } from 'react-native';

export default function CustomTabButton(props) {
  return (
    <Pressable
      {...props}
      android_ripple={null}
      style={[
        props.style,
        { borderRadius: 25 }
      ]}
    />
  );
}
