$(function(){
    //탭메뉴 
    $('.tab-nav a').click(function(e){
        e.preventDefault();
        $('.tab-nav a').removeClass('active');
        $(this).addClass('active');
        var id=$(this).attr('href');
        $('.tab-contents .content').hide();
        $(id).show();
        // 탭메뉴의 컨텐츠가 변경될때마다 ul의 높이 구하기
        ulHeight();
    })        

    //리사이즈 될때마다 ul의 높이 구하기
    $(window).resize(function(){
        ulHeight();
    }).resize();

    //장바구니, 위시리스트에 담길 리스트 묶음(ul)의 높이 구하기
    function ulHeight(){
        var windowH=$(window).height();
        var tabH=$('.tab-nav').outerHeight();
        var topH=$('.tab-contents .content').not(':hidden').find('.top').outerHeight();
        var bottomH=$('.tab-contents .content').not(':hidden').find('.bottom').outerHeight();        
        var ulH=windowH-(tabH+topH+bottomH);
        $('.tab-contents .content').not(':hidden').find('ul').height(ulH);
    }

    //3자리마다 콤마찍기
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
        
    //금액합산
    function totalPrice(){
        var total=0;
        // console.log('가격과 수량체크');
        $('#shopping li').each(function(){
            //만약 각 리스트에 접근해서 체크박스가 체크가 되어있다면
            if($(this).find('input').prop('checked')){
                //각 리스트의 상품 가격
                //현재 금액은 30,000원의 형태로 나오고 있으므로 숫자로 변환
                var price=parseInt($(this).find('dd').text().replace(',',''));
                total+=price;           
            }
        })
        //합계를 출력할 때 다시 콤마를 붙여서 출력
        $('#shopping .total .price').text(numberWithCommas(total)+'원');
    }

    //저장소 cart 가져오기
    function getCart(){
        var cartJSON=localStorage.getItem('item');      
        return JSON.parse(cartJSON);
    }

    //저장소 cart 저장하기 
    function setCart(cart){
        var cartJSON=JSON.stringify(cart);
        localStorage.setItem('item',cartJSON);
    }

    //상품리스트 불러오기     
    var product=getCart();
    if(product==null){
        $.ajax({
            url:'js/product.json',
            success:function (product) {
                productList(product);   
                setCart(product)        
            }
        })          
    }else{
        productList(product);
        cartList();
    }

    //제품 목록
    function productList(product) {
        $('.item ul').empty();
        product.forEach(item => {
            $('.item ul').append(`
                <li data-key="${item.key}">
                    <div class="wrap">
                    <img src="${item.img}" alt="">
                    <div class="box">
                        <h2>${item.name}</h2>
                        <span class="price">${numberWithCommas(item.price)}원</span>            
                        <div class="btn-group">
                            <button class="fas fa-heart ${item.like}"></button>
                            <button class="fas fa-shopping-cart ${item.shopping}"></button>
                        </div>
                    </div>
                    </div>
                </li>
            `)
        });
    }

    //위시리스트, 장바구니 목록 
    function cartList() {
        var product=getCart();
        $('#like ul, #shopping ul').empty();
        product.forEach(item => {
            if(item.like=='on'){
                $('#like ul').append(
                    `<li data-key="${item.key}">
                        <label><input type="checkbox"></label>
                        <img src="${item.img}">
                        <div class="box">
                            <dl>
                                <dt>${item.name}</dt>
                                <dd>${numberWithCommas(item.price)}</dd>
                            </dl>
                            <button class="btn-del">삭제</button>
                        </div>
                    </li>`);
            }
        });
        
        product.forEach(item => {
            if(item.shopping=='on'){
                $('#shopping ul').append(
                    `<li data-key="${item.key}">
                        <label><input type="checkbox"></label>
                        <img src="${item.img}">
                        <div class="box">
                            <dl>
                                <dt>${item.name}</dt>
                                <dd data-price="${item.price}">${numberWithCommas(item.price)}</dd>
                            </dl>
                            <div class="count-change">
                                <button class="down">-</button>
                                <span>1</span>              
                                <button class="up">+</button>
                            </div>
                            <button class="btn-del">삭제</button>
                        </div>
                    </li>`);
            }
        });
    }
    
    //선택된 리스트 수량 체크
    var likeCount=0;
    var shoppingCount=0;

    //선택된 아이템 
    function choiceItem(key) {
        var cart=getCart();
        var choice={};
        for (const item of cart) {
            if(item.key==key){
                choice=item;
                break;
            }
        }
        return choice;
    }

    //cart 상태 변경
    function cartChange(choice) {
        var cart=getCart();
        for (const i in cart) {            
            if(cart[i].key==choice.key){
                cart[i]=choice;
                break;
            }
        }
        setCart(cart);
    }

    //위시리스트, 장바구니 추가
    $('.item').on('click','button',function(){
        var key=$(this).parents('li').data('key');
        var choice=choiceItem(key);
        
        //항목 추가하기 
        if(!$(this).hasClass('on')){
            $(this).addClass('on');
            //위시리스트 담기
            if($(this).hasClass('fa-heart')){
                choice.like="on";
                $('#like ul').append(
                    `<li data-key="${choice.key}">
                        <label><input type="checkbox"></label>
                        <img src="${choice.img}">
                        <div class="box">
                            <dl>
                                <dt>${choice.name}</dt>
                                <dd>${numberWithCommas(choice.price)}</dd>
                            </dl>
                            <button class="btn-del">삭제</button>
                        </div>
                    </li>`);
            }else{
                //장바구니 담기 
                choice.shopping="on";               
                $('#shopping ul').append(
                    `<li data-key="${choice.key}">
                        <label><input type="checkbox"></label>
                        <img src="${choice.img}">
                        <div class="box">
                            <dl>
                                <dt>${choice.name}</dt>
                                <dd data-price="${choice.price}">${numberWithCommas(choice.price)}</dd>
                            </dl>
                            <div class="count-change">
                                <button class="down">-</button>
                                <span>1</span>              
                                <button class="up">+</button>
                            </div>
                            <button class="btn-del">삭제</button>
                        </div>
                    </li>`);
            }
            cartChange(choice);
        }else{
            alert('이미 담겨져 있습니다.');
        }    
    })

    //위시리스트, 장바구니 개별 삭제버튼
    $('.tab-contents').on('click','.btn-del',function(){
        //삭제하려고 하는 제품의 키값을 구한다.
        var key=$(this).parents('li').data('key');
        var choice=choiceItem(key);
        //console.log('삭제할 항목',key);
        var contentsName=$(this).parents('.content').attr('id');
        console.log('삭제할 항목을 감싸고 있는 영역',contentsName);
        //내가 누른 버튼을 감싸고 있는 리스트 삭제하기 
        $(this).parents('li').remove();
        if(contentsName=='like'){//위시리스트에서 삭제
            choice.like="";
            $('.item [data-key='+key+']').find('.fa-heart').removeClass('on');
            if($(this).parents('li').find('input').prop('checked')){
                likeCount--;
            }
            $('#like .count').text(likeCount+'개');
            if(likeCount==0){
                $('#like .top input').prop('checked',false);
            }
        }else{//장바구니에서 삭제
            choice.shopping="";
            $('.item [data-key='+key+']').find('.fa-shopping-cart').removeClass('on');
            if($(this).parents('li').find('input').prop('checked')){
                shoppingCount--;
            }
            $('#shopping .count').text(shoppingCount+'개');
            if(shoppingCount==0){
                $('#shopping .top input').prop('checked',false);
            }
        }
        cartChange(choice);
        totalPrice();
    })

    //선택한 리스트 전체삭제 
    $('.bottom .btn-del').click(function(){
        var checkCount=0;
        var contentsName=$(this).parents('.content').attr('id');
        $(this).parents('.content').find('li input').each(function(){
            //$(this) => 리스트 안에 있는 체크박스의 상태
            if($(this).prop('checked')){
                checkCount++;
                var key=$(this).parents('li').data('key');
                $('.item li').each(function(){
                    //$(this) => .item li
                    //팝업창 안에 있는 체크된 리스트의 키값과 상품목록(.item)에 있는 리스트의 키값이 일치할 경우
                    if($(this).data('key')==key){
                        if(contentsName=='like'){
                            $(this).find('.fa-heart').removeClass('on');
                            likeCount--;
                        }else{
                            $(this).find('.fa-shopping-cart').removeClass('on');
                            shoppingCount--;
                        }
                    }
                })
                // 체크되어진 리스트 삭제
                $(this).parents('li').remove();
            }
        })
        if(checkCount==0){
            alert('삭제할 상품을 선택하세요.');
        }
        totalPrice();
    })

    //전체선택(체크박스)
    $('.content .top input').change(function(){
        if($(this).prop('checked')){//체크를 한 상태
            if($(this).attr('name')=='like'){
                $('#like li input').prop('checked', true);
                likeCount=$('#like li').length;
                $('#like .count').text(likeCount+'개');
            }else{
                $('#shopping li input').prop('checked', true);
                shoppingCount=$('#shopping li').length;
                $('#shopping .count').text(shoppingCount+'개');
            }
        }else{//체크를 안한 상태
            if($(this).attr('name')=='like'){
                $('#like li input').prop('checked', false);
                likeCount=0;
                $('#like .count').text(likeCount+'개');
            }else{
                $('#shopping li input').prop('checked', false);
                shoppingCount=0;
                $('#shopping .count').text(shoppingCount+'개');
            }
        }
        //금액계산
        totalPrice();
    })

    //개별체크박스 선택
    $('.content').on('change','li input',function(){
        if($(this).prop('checked')){
            if($(this).parents('.content').attr('id')=='shopping'){
                shoppingCount++;
                $('#shopping .count').text(shoppingCount+'개');
            }else{
                likeCount++;
                $('#like .count').text(likeCount+'개');
            }
        }else{
            // 전체선택 해제
            $(this).parents('.content').find('.top input').prop('checked',false);
            if($(this).parents('.content').attr('id')=='shopping'){
                shoppingCount--;
                $('#shopping .count').text(shoppingCount+'개');
            }else{
                likeCount--;
                $('#like .count').text(likeCount+'개');
            }
        }
        totalPrice();
    })

    //수량 체크
    $('.content').on('click','.count-change button',function(){
        var count=$(this).siblings('span').text(); 
        if($(this).hasClass('down')){
            count--;
            if(count<1){
                alert('최소 수량입니다.');
                count=1;
            }
        }else{
            count++;
            if(count>10){
                alert('최대 수량입니다.');
                count=10;
            }
        }
        $(this).siblings('span').text(count); 
        
        //해당 제품 계산 
        var price=parseInt($(this).parents('.box').find('dd').data('price'));
        console.log(price*count);
        
        $(this).parents('.box').find('dd').text(numberWithCommas(price*count));

        //체크상태일때만 합계 계산 
        if($(this).parents('li').find('input').prop('checked')){
            totalPrice();
        }
    })

    //위시리스트에서 장바구니담기
    $('.btn-cart').click(function(){
        var checkCount=0;
        $('#like li input').each(function(){
            //체크된 상품만 장바구니에 추가
            if($(this).prop('checked')){
                var key=$(this).parents('li').data('key');
                var choice=choiceItem(key);
                choice.shopping='on';
                cartChange(choice);
                checkCount++;
            }
        })
        console.log('체크된 수',checkCount);
        if(checkCount==0){
            alert('추가할 상품을 선택하세요.');
        }else{
            var product=getCart();
            productList(product);
            cartList();
            $('#like .top input').prop('checked',false);
            likeCount=0;
            $('#like .top .count').text('0개');
        }
    })
})