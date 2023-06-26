import getOthersPosts from '../../net/user/getOthersPosts';
import getMyPosts from '../../net/user/getMyPosts';
import getPosts from '../../net/post/getPosts';
import getMyBookmarks from '../../net/bookmark/getMyBookmarks';
import getMainCategoryImages from '../../net/meta/getMainCategoryImages';
import getMainOotdImages from '../../net/meta/getMainOotdImages';
import moment from 'moment';
import getMerchandisePosts from '../../net/post/getMerchandisePost';
import getSearchPost from '../../net/post/getSearchPost';

export const getStyleFeedData = async (from, { props, page, otherUserId }) => {
  let data = {};
  switch (from) {
    case 'othersProfile':
      const [othersProfileData] = await getOthersPosts(otherUserId, page);
      data.lastPage = othersProfileData?.lastPage;
      data.posts = othersProfileData?.data;
      break;
    case 'myPage':
      const [myPageData] = await getMyPosts(page);
      data.lastPage = myPageData?.lastPage;
      data.posts = myPageData?.data;
      break;
    case 'challenge':
      const [challengeData] = await getPosts(page, 'Challenge');
      data.lastPage = challengeData?.lastPage;
      data.posts = challengeData?.data;
      break;
    case 'daily':
      const [dailyData] = await getPosts(page, 'Daily');
      data.lastPage = dailyData?.lastPage;
      data.posts = dailyData?.data;
      break;
    case 'mainHashOotd':
      const [mainHashOotdData] = await getMainOotdImages();
      data.posts = mainHashOotdData?.json || [];
      break;
    case 'mainOotdIndex':
      const [mainOotdIndexdata] = await getPosts(1, '', {
        order: 'rate',
        startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        except_id: props.context.user.id,
        ootd_user_id: props.context.user.id,
      });
      data.posts = mainOotdIndexdata?.data || [];
      break;
    case 'mainCategory1':
      const [dataCategory1] = await getMainCategoryImages('1');
      data.posts = dataCategory1.json?.images?.filter((v, i) => v !== null) || [];
      break;
    case 'mainCategory2':
      const [dataCategory2] = await getMainCategoryImages('2');
      data.posts = dataCategory2.json?.images?.filter((v, i) => v !== null) || [];
      break;
    case 'mainDailyPopular':
      const [dailyPopularData] = await getPosts(1, 'daily', {
        order: 'likes',
        startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      });
      data.posts = dailyPopularData?.data || [];
      break;
    case 'bookmark':
      const [bookmark] = await getMyBookmarks(page);
      data.posts =
        bookmark?.data.map?.((v, i) => ({
          ...v.post,
          __meta__: v.__meta__,
        })) || [];
      data.lastPage = bookmark?.lastPage;
      break;
    case 'searchMerchandise':
      const searchText = props?.route?.params?.searchText;
      const [searchMerchandise] = await getMerchandisePosts(page, '', {}, searchText);
      data.lastPage = searchMerchandise?.lastPage;
      data.posts = searchMerchandise?.data.filter((item) => item.posts.length !== 0);
      data.posts = data.posts.map((item) => {
        return item.posts[0];
      });
      break;
    case 'searchPost':
      const searchTxt = props?.route?.params?.searchText;
      const [searchPost] = await getSearchPost(page, '', {}, searchTxt);
      let result = [];
      data.lastPage = searchPost?.lastPage;
      data.posts = searchPost?.data;
      break;
    case 'search':
      const searchFilter = props?.route?.params?.searchFilter;
      const [searchData] = await getPosts(page, '', {
        style_id: searchFilter?.style,
        top_id: searchFilter?.top,
        bottom_id: searchFilter?.bottom,
        outer_id: searchFilter?.outer,
        gender_id: searchFilter?.gender,
        body_type_id: searchFilter?.body,
        height_id: searchFilter?.height,
      });

      data.lastPage = searchData?.lastPage;
      data.posts = searchData?.data;
      break;
    default:
      const [defaultData] = await getPosts(page);
      data.lastPage = defaultData?.lastPage;
      data.posts = defaultData?.data;
      break;
  }
  return data;
};
