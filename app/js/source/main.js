(function(){
  'use strict';

  $(document).ready(init);

  var current = 'ruby';
  var $source;

  function init(){
    initBoard();

    $('#board').on('click', '.active', select);
    $('#board').on('click', '.empty', move);
  }

  function select(){
    $source = $(this);
    $('.valid').removeClass('selected');
    $(this).addClass('selected');
  }

  function move(){
    if(!$source){return;}

    var $target = $(this);
    var isKing = $source.is('.king');

    var src = {}, tgt = {};
    src.x = $source.data('x') * 1;
    src.y = $source.data('y') * 1;
    tgt.x = $target.data('x') * 1;
    tgt.y = $target.data('y') * 1;

    var compass = {};
    compass.north = current === 'js' ? -1 : 1;
    compass.east = current === 'js' ? 1 : -1;
    compass.west = compass.east * -1;
    compass.south = compass.north * -1;

    switch(moveType(src, tgt, compass, isKing)){
      case 'move':
        movePiece($source, $target);
        switchUser();
        break;
      case 'jump':
        movePiece($source, $target);
        nukePiece(src, tgt);
        if(availableMove(tgt, compass, isKing)){
          $source = $target;
        }else{
          switchUser();
        }
    }
  }

  function availableMove(pos, compass, isKing){
    var xe = pos.x + (compass.east * 2);
    var yn = pos.y + (compass.north * 2);
    var xw = pos.x + (compass.west * 2);
    var ys = pos.y + (compass.south * 2);
    var coords = [xe, yn, xw, yn, xw, ys, xe, ys];
    var loops = isKing ? 4 : 2;

    for(var i = 0; i < loops; i++){
      var tmp = {};
      tmp.x = coords[i*2];
      tmp.y = coords[i*2 + 1];
      if(isEmpty(tmp) && isEnemy(pos, tmp)){
        return true;
      }
    }
  }

  function isEmpty(pos){
    return $('td[data-x='+pos.x+'][data-y='+pos.y+']').is('.empty');
  }

  function movePiece($source, $target){
    var tgt = $target.attr('class');
    var src = $source.attr('class');

    $target.attr('class', src);
    $source.attr('class', tgt);

    if(isCastle($target)){makeKing($target);}
  }

  function isCastle($piece){
    var castle = current === 'js' ? 0 : 7;
    return $piece.parent().index() === castle;
  }

  function makeKing($piece){
    $piece.removeClass('king').addClass('king');
  }

  function nukePiece(src, tgt){
    midpoint(src, tgt).removeClass().addClass('valid empty');
  }

  function moveType(src, tgt, compass, isKing){
    if(isMove(src, tgt, compass, isKing)){return 'move';}
    if(isJump(src, tgt, compass, isKing) && isEnemy(src, tgt)){return 'jump';}
  }

  function isMove(src, tgt, compass, isKing){
    return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x) && (src.y + compass.north === tgt.y || (isKing && (src.y + compass.south === tgt.y)));
  }

  function isJump(src, tgt, compass, isKing){
    return (src.x + (compass.east * 2) === tgt.x || src.x + (compass.west * 2) === tgt.x) && (src.y + (compass.north * 2) === tgt.y || (isKing && (src.y + (compass.south * 2) === tgt.y)));
  }

  function isEnemy(src, tgt){
    var enemy = current === 'js' ? '.ruby' : '.js';
    return midpoint(src, tgt).is(enemy);
  }

  function midpoint(src, tgt){
    var x = (src.x + tgt.x) / 2;
    var y = (src.y + tgt.y) / 2;
    return $('td[data-x='+x+'][data-y='+y+']');
  }

  function initBoard(){
    $('#board tr:lt(3) > .valid').addClass('ruby player');
    $('#board tr:nth-child(4) > .valid, #board tr:nth-child(5) > .valid').addClass('empty');
    $('#board tr:gt(4) > .valid').addClass('js player');
    switchUser();
  }

  function switchUser(){
    current = current === 'js' ? 'ruby' : 'js';
    $('.valid').removeClass('active selected');
    $('.' + current).addClass('active');
  }
})();
