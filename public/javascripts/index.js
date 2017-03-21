$(document).ready(function () {
    var profileData, showPopup = false;

    $.get('/javascripts/profile.json').then(function (data) {
        profileData = data;
        createStoryJS({
            type: 'timeline',
            width: "100%",
            height: "100%",
            start_at_end: true,
            source: profileData,
            embed_id: 'timeline-embed'
        });
    });

    $(document).on('click', 'img', function (e) {
        if (showPopup) return;

        showPopup = true;
        $('.media-image').magnificPopup({
            items: profileData.timeline.date.map(function (item) {
                return {
                    src: item.asset.media,
                    title: item.text
                }
            }),
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function (item) {
                    return item.title + '<small>by wang.xiaohu</small>';
                }
            },
            callbacks: {
                close: function () {
                    showPopup = false;
                }
            }
        });
    });
});
