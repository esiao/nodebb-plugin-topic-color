<h1><i class="fa fa-tint"></i> Colorify Topics</h1>
<hr />

<div class="alert alert-info">
    <p>This plugin allow some groups of users to colorify their topic titles.</p>
</div>

<form id="topic-color">
    <h3>Select the groups allowed to colorify their topics.</h3>
    <p>Create this group if you want only some users to use this feature.</p>
    <input type="checkbox" title="Bucket" id="Bucket" name="allowed" value="Bucket" checked><label for="Bucket">Bucket</label>

    <p>Choose from your existing groups.</p>
    <!-- BEGIN groups -->
    <input type="checkbox" title="{groups.name}" id="{groups.name}" name="allowed" value="{groups.name}"><label for="{groups.name}">{groups.name}</label>
    <!-- END groups -->
    <button class="btn btn-lg btn-primary" id="save">Save</button>
</form>

<script>
	$('#save').click( function (event) {
		event.preventDefault();
		var data = [];
		$('form#topic-color :checkbox').each(function(){
			var value = $(this).attr('value');
			if ($(this).is(':checked')) data.push(value);
		});
	});
</script>