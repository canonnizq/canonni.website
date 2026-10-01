import type { Platform } from '../types';
import bilibili from './bilibili';
import bluesky from './bluesky';
import discord from './discord';
import email from './email';
import flickr from './flickr';
import geocaching from './geocaching';
import github from './github';
import instagram from './instagram';
import mastodon from './mastodon';
import medium from './medium';
import reddit from './reddit';
import steam from './steam';
import tumblr from './tumblr';
import twitter from './twitter';
import wikimedia from './wikimedia';
import youtube from './youtube';

/**
 * Every platform rendered as a pill, in display order.
 *
 * To add a platform: drop a new file in this folder exporting a `Platform`,
 * then list it here.
 */
export const platforms: Platform[] = [
  bilibili,
  bluesky,
  discord,
  email,
  flickr,
  geocaching,
  github,
  instagram,
  mastodon,
  medium,
  reddit,
  steam,
  tumblr,
  twitter,
  wikimedia,
  youtube,
];

export type { Platform } from '../types';
