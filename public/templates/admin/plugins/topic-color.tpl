<h1><i class="fa fa-tint"></i> Colorify Topics</h1>
<hr />

<div class="bg-primary alert">
    <p>This plugin allow some groups of users to colorify their topic titles.</p>
</div>

<form id="topic-color">
    <h3>Select the groups allowed to colorify their topics.</h3>
    <p>Create this group if you want only some users to use this feature.</p>
    <input type="checkbox" title="Bucket" id="Bucket" name="allowed" value="Bucket" disabled checked> <label for="Bucket">Bucket</label>

    <div id="groups">
        <p>Choose from your existing groups. <span class='inline-warning'>(system groups are ignored)</span></p>
    </div>
    <button class="btn btn-lg btn-primary" id="save">Save</button>
</form>

<script type='text/javascript'>

    $.getJSON('/api/groups', function (data) {
            if (data.groups.length == 0){
                $('#groups').append('<p class="alert alert-warning">You don\'t have any groups set</p>');
            } else if (data.groups.length == 1) {
                $.each(data.groups, function (i, group) {
                    if (group.name == 'Bucket') {
                        $('#groups').append('<p class="alert alert-warning">You don\'t have any other groups set</p>');
                    } else {
                        $('#groups').append('<input type="checkbox" title="'+group.name+'" id="'+group.name+'" name="allowed" value="'+group.name+'"> <label for="'+group.name+'">'+group.name+'</label>');
                    }
                });
            } else {
                $.each(data.groups, function (i, group) {
                    if (group.name != 'Bucket') {
                        $('#groups').append('<input type="checkbox" title="'+group.name+'" id="'+group.name+'" name="allowed" value="'+group.name+'"> <label for="'+group.name+'">'+group.name+'</label>');
                    }
                });                
            };
            $.getJSON('/api/admin/plugins/topic-color', function (data) {
                groups = data.allowedGroups;
                $.each(groups, function(i, group){
                    $('#'+group).attr('checked','checked');
                });
            });
    });

    $('#save').click( function (event) {

        event.preventDefault();

        var allowGroups = [];
        $('form#topic-color :checkbox').each(function(index){
            var value = $(this).attr('value');
            if ($(this).is(':checked')) allowGroups.push(value);
        });

        $.post('/api/admin/plugins/topic-color/save', {
            _csrf : $('#csrf_token').val(),
            allowedGroups : JSON.stringify(allowGroups)
        }, function(data) {
            if(typeof data === 'string') {
                app.alertSuccess(data);
            }
        });

    });

</script>