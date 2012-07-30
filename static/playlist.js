(function() {

var App = function() {
  this.init();

  this.curPlaylist = null;
};

App.prototype.init = function() {
  var that = this;

  // cache selectors
  this.playlistHolder = $('#playlist_holder');

  // bind input
  $('#playlist_submit').click(function() {
    //that.loadPlaylist($('#playlist').val());
    that.loadMoreSongs($('#playlist').val());
  });
};

App.prototype.loadMoreSongs = function(key) {
  var that = this;
  $.ajax({
    url: '/loadMoreSongs',
    data: {
      key: key
    },
    success: function(response) {
      console.info('GOT NEW SONGS: ' + response);
    }
  });
};

App.prototype.loadPlaylist = function(playlistUrl) {
  var that = this;

  // load from api
  $.ajax({
    url: '/loadPlaylist',
    data: {
      url: playlistUrl
    },
    success: function(response) {
      that.curPlaylist = response.result;
      var html = that.renderPlaylist(that.curPlaylist);
      that.playlistHolder.empty().append(html);
    }
  });
};

App.prototype.renderPlaylist = function(playlist) {
  var div = $('<div></div>');

  // display name
  div.append($('<h3></h3>').text(playlist.name));

  // display description
  if (playlist.description) {
    div.append($('<div></div>').text(playlist.description));
  }

  // loop through tracks, render each
  if (playlist.tracks.length) {
    div.append(this.renderTracks(playlist.tracks));
  }

  return div.html();
};

App.prototype.renderTracks = function(tracks) {
  var div = $('<div></div>');

  var ul = $('<ul></ul>');

  _.each(tracks, function(track) {
    var trackName = track.artist + ' - ' + track.name;
    ul.append($('<li></li>').text(trackName));
  });

  div.append(ul);

  return div.html();
};

$(document).ready(function() {
  window.app = new App();
});

})();
