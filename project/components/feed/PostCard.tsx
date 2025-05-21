import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, MessageCircle, Share2, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { Post } from '@/utils/types';
import Colors from '@/utils/colors';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: Post;
  onLike: () => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.postTime}>{post.timeAgo}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MoreHorizontal size={24} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      {post.image && (
        <Image 
          source={{ uri: post.image }} 
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Heart 
            size={28} 
            color={post.liked ? Colors.error : Colors.text.secondary} 
            fill={post.liked ? Colors.error : 'transparent'} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={28} color={Colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={28} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.likes}>{post.likes} likes</Text>
        {post.text && (
          <Text style={styles.postText}>
            <Text style={styles.userName}>{post.userName}</Text> {post.text}
          </Text>
        )}
        {post.comments > 0 && (
          <Text style={styles.comments}>View all {post.comments} comments</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
  },
  postTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  postImage: {
    width: width,
    height: width,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButton: {
    marginRight: 16,
    padding: 4,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  likes: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  postText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  comments: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});