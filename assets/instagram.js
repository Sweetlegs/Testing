!function(e) {
    var a= {
        username: "", container: "", display_profile: !0, display_biography: !0, display_gallery: !0, get_raw_json: !1, callback: null, styling: !0, items: 3, items_per_row: 3, margin: .5
    }
    ;
    e.instagramFeed=function(i) {
        if(""!=(i=e.fn.extend( {}
        , a, i)).username||''!=i.tag)if(i.get_raw_json||''!=i.container)if(i.get_raw_json&&null==i.callback)console.log('Instagram Feed: Error, no callback defined to get the raw json');
        else {
            var r='https://www.instagram.com/'+i.username;
            e.get(r, function(a) {
                if(a=(a=(a=(a=a.split('window._sharedData = '))[1].split('<\/script>'))[0]).substr(0, a.length-1), a=(a=JSON.parse(a)).entry_data.ProfilePage[0].graphql.user, i.get_raw_json)i.callback(JSON.stringify( {
                    id: a.id, username: a.username, full_name: a.full_name, is_private: a.is_private, is_verified: a.is_verified, biography: a.biography, followed_by: a.edge_followed_by.count, following: a.edge_follow.count, images: a.edge_owner_to_timeline_media.edges
                }
                ));
                else {
                    var r= {
                        profile_container: '', profile_image: '', profile_name: '', profile_biography: '', gallery_image: ''
                    }
                    ;
                    if(i.styling) {
                        r.profile_container=' style="text-align:center;"', r.profile_image=' style="border-radius:10em;width:15%;max-width:125px;min-width:50px;"', r.profile_name=' style="font-size:1.2em;"', r.profile_biography=' style="font-size:1em;"';
                        var l=(100-2*i.margin*i.items_per_row)/i.items_per_row;
                        r.gallery_image=' style="width:100%;"'
                    }
                    var n='';
                    if(i.display_profile&&(n+='<div class="instagram_profile"'+r.profile_container+'>', n+='   <img class="instagram_profile_image" src="'+a.profile_pic_url+'" alt="'+i.username+' profile pic"'+r.profile_image+' />', n+='   <p class="instagram_username"'+r.profile_name+'>@'+a.full_name+' (<a href="https://www.instagram.com/'+i.username+'">@'+i.username+'</a>)</p>'), i.display_biography&&(n+='  <p class="instagram_biography"'+r.profile_biography+'>'+a.biography+'</p>'), i.display_profile&&(n+='</div>'), i.display_gallery)if(a.is_private)n+='<p class="instagram_private"><strong>This profile is private</strong></p>';
                    else {
                        var t=a.edge_owner_to_timeline_media.edges;
                        max=t.length>i.items?i.items: t.length;
                        for(var s=0;
                        s<max;
                        s++) {
                            n+='<div class="grid__item medium-up--one-quarter medium--one-half">', n+='  <a class="instagram-item" href="'+("https://www.instagram.com/p/"+t[s].node.shortcode)+'" target="_blank"><img src="'+t[s].node.thumbnail_src+'" alt="'+i.username+' instagram image '+s+'"'+r.gallery_image+' /></a>', n+='</div>'
                        }
                        
                    }
                    e(i.container).html(n);
                }
            }
            )
        }
        else console.log('Instagram Feed: Error, no container found.');
        else console.log('Instagram Feed: Error, no username or tag found.')
    }
}

(jQuery),
function(e) {
    e(window).on('load', function() {
        var a=document.getElementById('instagram-feed').getAttribute('data-user');
        e.instagramFeed( {
            username: a, container: '#instagram-feed', display_profile: !1, display_biography: !1, display_gallery: !0, get_raw_json: !1, callback: null, styling: !0, items: 4, items_per_row: 3, margin: 0
        }
        )
    }
    )
}

(jQuery);